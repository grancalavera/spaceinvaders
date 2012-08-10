define(function (require) {
    'use strict';
    var Crafty = require('crafty'),
        _ = require('underscore'),

    //--------------------------------------------------------------------------
    //
    // Game set up
    //
    //--------------------------------------------------------------------------
        renderMode = 'Canvas',
        // World dimensions
        ww = 480,
        wh = 640,
        // Tile size
        ts = 32,
        // Initial position for alien cloud
        ox = 2 * ts,
        oy = 5 * ts,
        // Dimensions for the alien cloud
        rows = 5,
        cols = 11,
        // Game sprite
        sprite = 'img/enemies-and-hero.png';

    //--------------------------------------------------------------------------
    //
    // Sprites
    //
    //--------------------------------------------------------------------------

    Crafty.sprite(ts, sprite, {
        alien1: [0, 0],
        alien2: [0, 1],
        alien3: [0, 2],
        hero:   [0, 3]
    });

    //--------------------------------------------------------------------------
    //
    // Crafty components
    //
    //--------------------------------------------------------------------------


    //----------------------------------
    //
    // Alien
    //
    //----------------------------------

    Crafty.c('Alien', {
        animation: 'flip',
        destroyDelay: 250,
        // The row and column where the Alien was originally spawned.
        row: 0,
        col: 0,
        init: function () {
            this.requires('2D, SpriteAnimation, Collision, ' + renderMode);
            return this;
        },
        Alien: function (row, col, spriteRow) {
            this.row = row;
            this.col = col;
            this
                .animate('explode', 2, spriteRow, 2)
                .animate('flip', 0, spriteRow, 1)
                .animate('flop', 1, spriteRow, 0);
            return this;
        },
        kill: function () {
            this
                .animate('explode', 1)
                .timeout(function () {
                    this.destroy();
                }, this.destroyDelay);
            return this;
        },
        toggle: function () {
            this.animate(this.animation, 1);
            this.animation = this.animation === 'flip' ? 'flop' : 'flip';
            return this;
        }
    });

    //----------------------------------
    //
    // AlienCloud
    //
    //----------------------------------

    Crafty.c('AlienCloud', {
        aliens: [],
        cloudSize: 0,
        off: {
            x: 0,
            y: 0
        },
        ts: 0,
        spawnDelay: 30,
        edges: {
            l: null,
            r: null
        },
        bounds: {
            l: 0,
            r: 0
        },
        delay: 500,
        stepSize: 0,
        dir: 1,
        locked: false,
        init: function () {
            return this;
        },
        AlienCloud: function (rows, cols, ox, oy, ww, wh, ts) {
            var i;
            this.rows = rows;
            this.cols = cols;
            this.cloudSize = rows * cols;
            this.off.x = ox;
            this.off.y = oy;
            this.ts = ts;
            this.aliens = [];
            this.bounds = {
                l: ts,
                r: ww - ts * 2
            };
            this.stepSize = this.ts / 4;
            for (i = 0; i < rows; i += 1) {
                this.aliens[i] = [];
            }
            this.bind('ready', function () {
                this.edges = this.getEdges();
            });
            this.spawnAlien(4, 0);
            return this;
        },
        spawnAlien: function (row, col) {
            var alien, spriteRow;

            switch (row) {
            case 0:
                alien = 'alien2';
                spriteRow = 1;
                break;
            case 1:
            case 2:
                alien = 'alien1';
                spriteRow = 0;
                break;
            case 3:
            case 4:
                alien = 'alien3';
                spriteRow = 2;
                break;
            }

            this.aliens[row][col] = Crafty.e('Alien, ' + alien)
                .Alien(row, col, spriteRow)
                .attr({
                    x: col * this.ts + this.off.x,
                    y: row * this.ts + this.off.y
                });

            if (this.getAliveCount() < this.cloudSize) {
                if (col < this.cols - 1) {
                    col += 1;
                } else {
                    col = 0;
                    row -= 1;
                }
                this.timeout(function () {
                    this.spawnAlien(row, col);
                }, this.spawnDelay);
            } else {
                this.trigger('ready');
            }
        },
        getAliveCount: function () {
            return _.reduce(this.aliens, function (count, row) {
                return count + row.length;
            }, 0);
        },
        getEdges: function () {
            var l = null, r  = null, i, curr, row;
            // Left.
            for (i = this.aliens.length - 1; i > 0; i -= 1) {
                curr = this.aliens[i];
                if (_.isNull(l) || curr.col < l.col) {
                    l = curr;
                }
            }
            // Right.
            for (i = this.aliens.length - 1; i > 0; i -= 1) {
                row = this.aliens[i];
                curr = row[row.length - 1];
                if (_.isNull(r) || curr.col > r.col) {
                    r = curr;
                }
            }
            return {l: l, r: r};
        },
        start: function () {
            this.bind('EnterFrame', this.checkPosition);
        },
        checkPosition: function () {
            var lastRow = this.aliens.length - 1;
            if (this.locked) {
                return;
            }
            if (this.dir === 1) {
                if (this.edges.r.x + this.stepSize < this.bounds.r) {
                    this.move(lastRow);
                } else {
                    this.stepDown(lastRow);
                }
            } else {
                if (this.edges.l.x - this.stepSize > this.bounds.l) {
                    this.move(lastRow);
                } else {
                    this.stepDown(lastRow);
                }
            }
        },
        move: function (row) {
            this.locked = true;
            console.log('move');
            console.log(this.aliens[row]);
        },
        stepDown: function (row) {
            this.locked = true;
            console.log('stepDown');
            console.log(this.aliens[row]);
        }
    });

    //--------------------------------------------------------------------------
    //
    // Scenes
    //
    //--------------------------------------------------------------------------

    Crafty.scene('loading', function () {
        Crafty.load([sprite], function () {
            Crafty.scene('main');
        });
        Crafty.e('2D, Text, ' + renderMode)
            .attr({w: 640, h: 480, x: 5, y: 5})
            .text('loading...');
        Crafty.background('black');
    });

    Crafty.scene('main', function () {
        var cloud = Crafty.e('AlienCloud')
            .AlienCloud(rows, cols, ox, oy, ww, wh, ts);
        cloud.bind('ready', function () {
            console.log('cloud ready');
            cloud.start();
        });
        Crafty.background('black');
    });

    //--------------------------------------------------------------------------
    //
    // Kick off!
    //
    //--------------------------------------------------------------------------

    Crafty.init(ww, wh);
    Crafty.canvas.init();
    Crafty.scene('loading');

});
