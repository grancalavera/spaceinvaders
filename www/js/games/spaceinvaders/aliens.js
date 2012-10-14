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
        _           = require('underscore'),
        ArrayUtils  = require('arrayutils');

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
        alive: true,
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
            if (!this.alive) {
                return this;
            }
            this.alive = false;
            this
                .trigger('killed')
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
        },
        fire: function () {
            this.kill();
        }
    });

    //----------------------------------
    //
    // AlienCloud
    //
    //----------------------------------

    Crafty.c('AlienCloud', {
        aliens: null,
        fireRow: [],
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
            _move: 500,
            _stepDown: 100,
            _spawn: 30,
            _factor: 1
        },
        stepSize: 0,
        dir: 1,
        locked: false,
        graveyard: [],
        init: function () {
            return this;
        },
        AlienCloud: function (rows, cols, ox, oy, ww, wh, ts) {
            var i;

            this.rows = rows;
            this.cols = cols;
            this.cloudSize = this.rows * this.cols;
            this.off.x = ox;
            this.off.y = oy;
            this.ts = ts;
            this.aliens = new ArrayUtils.RowMajor(this.rows, this.cols);
            this.stepSize = this.ts * 0.2;
            this.bounds = {
                l: (ts * 0.75),
                r: ww - ((ts * 0.75) * 2)
            };
            this.setSpeed(1, true);
            for (i = 0; i < this.rows; i += 1) {
                this.aliens[i] = [];
            }
            this.bind('ready', function () {
                this.updateEdges();
            });
            this.spawnAlien(this.rows - 1, 0);
            return this;
        },
        spawnAlien: function (row, col) {
            var alien, spriteRow, self = this;

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
                })
                .bind('killed', function () {
                    self.killAlien(this);
                });
            this.aliens.addAt(row, col, alien);

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
            return this.aliens.countTruthy();
        },
        updateEdges: function () {
            var row, i, left = null, right = null, current = null;

            for (i = this.rows - 1; i > -1; i -= 1) {

                row = this.aliens.getRow(i);
                if (row.countTruthy()) {

                    // Left
                    current = row.firstTruthy();
                    if (_.isNull(left) || current.col < left.col) {
                        left = current;
                    }

                    // Right
                    current = row.lastTruthy();
                    if (_.isNull(right) || current.col > right.col) {
                        right = current;
                    }
                }
            }
            this.edges = {l: left, r: right};
        },
        killAlien: function (alien) {
            this.aliens.deleteAt(alien.row, alien.col);
            this.updateEdges();
        },
        killRow: function () {
            var row = this.aliens.length - 1;
            _.each(this.aliens[row], function (alien) {
                alien.kill();
            }, this);
        },
        killColumn: function () {
            console.log('Kill alien column');
        },
        start: function (speed) {
            if (_.isNumber(speed)) {
                this.setSpeed(speed);
            }
            this.bind('EnterFrame', this.checkPosition);
        },
        stop: function () {
            this.unbind('EnterFrame', this.checkPosition);
        },
        checkPosition: function () {
            var lastRow = this.getLastAliveRowIndex();

            if (this.locked) {
                return;
            }


            if (this.getAliveCount() === 0) {
                this.stop();
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
        getLastAliveRowIndex: function () {
            var i;
            for (i = this.rows - 1; i > -1; i -= 1) {
                if (this.aliens.getRow(i).countTruthy()) {
                    break;
                }
            }
            return i;
        },
        move: function (row) {
            var alienRow = this.aliens.getRow(row).toArray(), x;
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
                    this.updateEdges();
                    this.locked = false;
                }

            }, this.speed.move);
        },
        stepDown: function (row) {
            var alienRow = this.aliens.getRow(row).toArray(), x, y;
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
                    this.updateEdges();
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
        },
        getShooters: function () {
            var shooters = _.map(this.aliens.getColumns().toArray(), function (col) {
                return col.lastTruthy();
            });
            // Empty columns will return an undefined element :(
            shooters = _.without(shooters, undefined);
            console.log(shooters);
            return shooters;
        },
        fire: function () {
            console.log('fire');
            console.log(this.getShooters().length);
            // var l, alien;
            // l = this.fireRow.length;
            // alien = this.fireRow[Crafty.math.randomInt(0, l - 1)];
            // alien.fire();
        }
    });
});
