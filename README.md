# just-wait <sup><sub>v1.0.5</sub></sup>

[![version](https://img.shields.io/npm/v/just-wait.svg)](https://npmjs.org/package/just-wait) ![license](https://img.shields.io/npm/l/just-wait.svg) ![installs](https://img.shields.io/npm/dt/just-wait.svg)

Waits for a file or directory to change or appear, then just returns. The watched file or directory does not have to exist yet.

## Installation

```bash
npm install --g just-wait
```

## Usage

```bash
# Use --help or -h to see usage details
$ just-wait --help
Usage: just-wait [options]

  Options:

    -h, --help                  output usage information
    -p, --pattern <pattern>     glob pattern. "," separates multiple patterns.
                                More info: https://github.com/isaacs/minimatch
    -d, --delay <milliseconds>  delay returning for a number of milliseconds
    -t, --timeout <seconds>     timeout waiting after a number of seconds (default=30)
    -s, --silent                supress logging.

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

It uses [picolog](https://npmjs.org/package/picolog) for logging, which allows us
to influence logging verbosity. The `Waiting for..` line is logged at level
`WARN` (which means it is visible at picolog's default log level of `WARN`) and
both the success and error message are logged at level `ERROR`. You can change
the picolog log level by setting the environment variable `PICOLOG_LEVEL`, or you
can completely suppress logging by passing the `--silent` (or `-s`) flag.

## Credits
Based off of [Rick Wong](https://github.com/RickWong)'s [wait-run](https://www.npmjs.com/package/wait-run),
this simplified version just waits for the file or directory to appear/change and then returns. It does not
execute any commands. Use it by chaining commands after it using `&&`, which works under *nix as well as Windows.

Credits also go to [Fabian Eichenberger](https://github.com/queckezz), who created [watch-run](https://github.com/queckezz/watch-run),
which was the basis for Rick's version.

Special thanks to [Mark Reynolds](https://github.com/lostthetrail) for making all our lives easier with his [contribution](https://github.com/Download/just-wait/pull/1).

## Copyright
* © 2016, [Stijn de Witt](http://StijnDeWitt.com). (this project)
* © 2016, [Rick Wong](https://github.com/RickWong). (wait-run)
* © 2015, [Fabian Eichenberger](https://github.com/queckezz). (watch-run)

## License
* [Creative Commons Attribution 4.0 (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/) (this project)
* [BSD 3-Clause license](https://opensource.org/licenses/BSD-3-Clause) (wait-run)
* [MIT License](https://opensource.org/licenses/MIT) (watch-run)
