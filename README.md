# Space Invaders

This is a clone of [Space Invaders](http://en.wikipedia.org/wiki/Space_Invaders) that runs on a regular browser without plugins.

## Running the game

### Dependencies

* [CraftyJS](https://github.com/craftyjs/Crafty)
* [RequireJS](https://github.com/jrburke/requirejs)
* [Backbone](https://github.com/documentcloud/backbone)
* [Underscore](https://github.com/documentcloud/underscore)

## Building with Volo

### Dependencies

* [NodeJS and NPM](http://nodejs.org/)
* [Volo](https://github.com/volojs/volo)

## Project structure

* www/ - the web assets for the project
    * index.html - the entry point into the app.
    * js/
        * app.js - the top-level config script used by index.html
        * app/ - the directory to store project-specific scripts.
        * games/ - the directory where all the game files live.
        * lib/ - the directory to hold third party scripts.
* tools/ - the build tools to optimize the project.

To optimize, run:

    volo build

This will run the "build" command in the volofile that is in this directory.

That build command creates an optimized version of the project in a
**www-built** directory. The js/app.js file will be optimized to include
all of its dependencies.

For more information on the optimizer:
http://requirejs.org/docs/optimization.html

For more information on using requirejs:
http://requirejs.org/docs/api.html
