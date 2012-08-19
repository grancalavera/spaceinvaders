/**
 * Aliens
 *
 * Aliens module for Space Invaders.
 *
 * @author leoncoto@gmail.com
 */
define(function (require) {
    'use strict';
    var Crafty      = require('crafty'),
        _           = require('underscore');

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
            this.requires('2D, SpriteAnimation, Collision, Canvas');
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
        edges: {
            l: null,
            r: null
        },
        bounds: {
            l: 0,
            r: 0
        },
        speed: {
            move: 0,
            stepDown: 0,
            spawn: 0,
            _move: 250,
            _stepDown: 100,
            _spawn: 30,
            _factor: 1
        },
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
            this.stepSize = this.ts * 0.2;
            this.bounds = {
                l: (ts * 0.75),
                r: ww - ((ts * 0.75) * 2)
            };
            this.setSpeed(1, true);
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
                alien = 'alienTop';
                spriteRow = 0;
                break;
            case 1:
            case 2:
                alien = 'alienMiddle';
                spriteRow = 1;
                break;
            case 3:
            case 4:
                alien = 'alienBottom';
                spriteRow = 2;
                break;
            }

            alien = Crafty.e('Alien, ' + alien)
                .Alien(row, col, spriteRow)
                .attr({
                    x: col * this.ts + this.off.x,
                    y: row * this.ts + this.off.y
                });
            this.aliens[row][col] = alien;

            if (this.getAliveCount() < this.cloudSize) {
                if (col < this.cols - 1) {
                    col += 1;
                } else {
                    col = 0;
                    row -= 1;
                }
                this.timeout(function () {
                    this.spawnAlien(row, col);
                }, this.speed.spawn);
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
                row = this.aliens[i];
                curr = row[0];
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
                    this.dir *= -1;
                    this.stepDown(lastRow);
                }
            } else {
                if (this.edges.l.x - this.stepSize > this.bounds.l) {
                    this.move(lastRow);
                } else {
                    this.dir *= -1;
                    this.stepDown(lastRow);
                }
            }
        },
        move: function (row) {
            var alienRow = this.aliens[row], x;
            this.locked = true;
            _.each(alienRow, function (alien) {
                x = alien.x + this.stepSize * this.dir;
                alien.attr({x: x});
                alien.toggle();
            }, this);

            row -= 1;

            this.timeout(function () {
                if (row > -1) {
                    this.move(row);
                } else {
                    this.locked = false;
                }

            }, this.speed.move);
        },
        stepDown: function (row) {
            var alienRow = this.aliens[row], x, y;
            this.locked = true;

            _.each(alienRow, function (alien) {
                x = alien.x + this.stepSize * this.dir;
                y = alien.y + this.ts;
                alien.attr({x: x, y: y});
            }, this);

            row -= 1;

            this.timeout(function () {
                if (row > -1) {
                    this.stepDown(row);
                } else {
                    this.locked = false;
                    this.increaseSpeed();
                }
            }, this.speed.stepDown);
        },
        setSpeed: function (factor, initial) {
            this.speed.move = this.speed._move / factor;
            this.speed._factor = factor;
            if (initial) {
                this.speed.stepDown = this.speed._stepDown / factor;
                this.speed.spawn = this.speed._spawn / factor;
            }
        },
        increaseSpeed: function () {
            var factor = this.speed._factor + 0.7;
            this.setSpeed(factor);
        }
    });
});
