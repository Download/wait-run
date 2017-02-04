# just-wait <sup><sub>v1.0.10</sub></sup>

[![version](https://img.shields.io/npm/v/just-wait.svg)](https://npmjs.org/package/just-wait)
![license](https://img.shields.io/npm/l/just-wait.svg)
![installs](https://img.shields.io/npm/dt/just-wait.svg)

Waits for a file or directory to change or appear, then just returns. The watched file or directory does not have to exist yet.

## Installation

To use `just-wait` from the command-line, install it globally:

```sh
npm install -g just-wait
```

To make sure your package is portable, also install it locally:

```sh
npm install --save-dev just-wait
```

## Usage

```sh
# Use --help or -h to see usage details
$ just-wait --help
Usage: just-wait [options]

  Options:

    -h, --help                  output usage information
    -p, --pattern <pattern>     glob pattern. "," separates multiple patterns.
                                More info: https://github.com/isaacs/minimatch
    -d, --delay <milliseconds>  delay returning for a number of milliseconds
    -t, --timeout <seconds>     timeout waiting after a number of seconds (default=30)
    -s, --silent                suppress logging.

  Examples:

    # watch "lib" dir, return when something changes
    $ just-wait -p "lib/**"

    # watch "lib" and "src" dirs, return 500ms after something changes
    $ just-wait -p "lib/**,src/**" -d 500

    # watch "lib" dir, timeout after 10 seconds
    $ just-wait -p "lib/**,src/**" -t 10
```

In the case of a timeout, `just-wait` will return with exit code `1`.
In other cases it will return with exit code `0`

### From package.json

`just-wait` is usually used in the `scripts` section of package.json, to
wait for some other, parallel task to create or change a file.

An example might be bundling your server code with the `--watch` flag.
This makes webpack watch for changes... but it also means the command does
not return so how do we actually start our server after the initial build has
succeeded? Simple! We just wait for server.js to have been created!

```json
{
  "scripts": {
	"build": "webpack -p",
	"build-dev": "webpack -d --watch",
    "start": "node server.js",
	"start-dev": "just-wait -p \"server.js\" && npm run start",
	"dev": "run-p --silent build-dev start-dev"
  }
}
```

Running `npm run dev` will run the `build-dev` and `start-dev` commands in parallel.
The `start-dev` command then uses `just-wait` to wait for server.js to appear or change.

## Logging
By default `just-wait` will log two messages to the terminal to provide
feedback to the user:

```bash
$ just-wait -p README.md && echo Done!
Waiting for README.md (max 30 seconds)
Ready. README.md changed
Done!
$
```

or, in the case of timeout:

```bash
$ just-wait -p README.md --timeout 10 && echo Done!
Waiting for README.md (max 10 seconds)
Timed out waiting for README.md after 10 seconds.
$
```

It uses [ulog](https://npmjs.org/package/ulog) for logging, which allows us
to influence logging verbosity. The `Waiting for..` line is logged at level
`INFO` (which means it is visible at ulog's default log level of `INFO`), the
success message is logged at `WARN` and the error message is logged at level
`ERROR`. You can change the log level by [setting the environment variable
`LOG`](https://github.com/download/ulog#environment-variable), or you
can completely suppress logging by passing the `--silent` (or `-s`) flag.

## Credits
Based off of [Rick Wong](https://github.com/RickWong)'s [wait-run](https://www.npmjs.com/package/wait-run),
this simplified version just waits for the file or directory to appear/change and then returns. It does not
execute any commands. Use it by chaining commands after it using `&&`, which works under *nix as well as Windows.

Credits also go to [Fabian Eichenberger](https://github.com/queckezz), who created [watch-run](https://github.com/queckezz/watch-run),
which was the basis for Rick's version.

Special thanks to [Mark Reynolds](https://github.com/lostthetrail) for making all our lives easier with his [contribution](https://github.com/Download/just-wait/pull/1).

## Copyright
* © 2017, [Stijn de Witt](http://StijnDeWitt.com). (this project)
* © 2016, [Rick Wong](https://github.com/RickWong). (wait-run)
* © 2015, [Fabian Eichenberger](https://github.com/queckezz). (watch-run)

## License
* [Creative Commons Attribution 4.0 (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/) (this project)
* [BSD 3-Clause license](https://opensource.org/licenses/BSD-3-Clause) (wait-run)
* [MIT License](https://opensource.org/licenses/MIT) (watch-run)