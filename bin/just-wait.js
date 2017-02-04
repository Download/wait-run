#!/usr/bin/env node

/**
 * Module dependencies.
 */
var program = require('commander');
var join = require('path').join;
var Gaze = require('gaze').Gaze;
var chalk = require('chalk');
var log = require('ulog')('just-wait')

var  g=chalk.green, gb=chalk.green.bold,  r=chalk.red, rb=chalk.red.bold,
	wh=chalk.white, wb=chalk.white.bold, gr=chalk.grey;

var done = false;

var list = function(val) {
	return val.split(',').map(function(val) {
		return val.trim()
	})
}

/**
 * Options.
 */
program
	.usage('')
	.option('-p, --pattern <pattern>', 'glob pattern. "," separates multiple patterns.\n' +
		'                            More info: https://github.com/isaacs/minimatch', list, '**')
	.option('-d, --delay <milliseconds>', 'delay returning for a number of milliseconds', parseInt)
	.option('-t, --timeout <seconds>', 'timeout waiting after a number of seconds (default=30)', parseInt)
	.option('-s, --silent', 'suppress logging.')

/**
 * Examples.
 */
program.on('--help', function() {
	log.info();
	log.info(wh('  Examples:'));
	log.info();
	log.info(gr('    # watch "lib" dir, return when something changes'));
	log.info(wh('    $ just-wait -p "lib/**"'));
	log.info();
	log.info(gr('    # watch "lib" and "src" dirs, return 500ms after something changes'));
	log.info(wh('    $ just-wait -p "lib/**,src/**" -d 500'));
	log.info();
	log.info(gr('    # watch "lib" dir, timeout after 10 seconds'));
	log.info(wh('    $ just-wait -p "lib/**,src/**" -t 10'));
	log.info();
})

/**
 * Parse argv.
 */
program.parse(process.argv);

var
delay = program.delay || 0,
timeout = program.timeout || 30,
silent = program.silent || false,
pattern = program.pattern;

if (!silent) {
	log.info(wb('Waiting ') + wh('for %s (max %d seconds)'), pattern, timeout);
}

setTimeout(function(){
	if (!silent) {
		log.error(chalk.red.bold('Timed out ') + chalk.red('waiting for %s after %d seconds.'), pattern, timeout);
	}
	process.exit(1);
}, timeout * 1000);

/**
 * Watch.
 */
var watch = new Gaze(program.pattern);
watch.on('all', stop);
watch.on('nomatch', nomatch);

/**
 * Execute command when file in dir changes.
 *
 * @param {String} event
 * @param {String} path
 */
function stop(event, path) {
	if (done) {return;}
	done = true;

	setTimeout(function() {
		if (!silent) {
			log.warn(chalk.green.bold('Ready. ') + chalk.green(pattern + ' ' + event));
		}
		process.exit(0);
	}, delay);
}

/**
 * If the pattern couldn't be found, then keep globbing until a match is found.
 */
function nomatch() {
	watch.close();

	if (done) {
		return;
	}

	setTimeout(function () {
		watch = new Gaze(program.pattern);
		watch.on('all', stop);
		watch.on('nomatch', nomatch); // Recursion
		watch.on('ready', function(watcher) {
			var keys = Object.keys(watcher._watched);
			if (keys && keys.length) {
				stop('added', watcher._watched[keys[0]]);
			}
		});
	}, delay || 500);
}
