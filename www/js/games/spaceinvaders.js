define(function (require) {
    'use strict';

    var Crafty          = require('crafty'),
        worldWidth      = 480,
        worldHeight     = 640,
        tileSize        = 32,
        offsetX         = 2 * tileSize,
        offsetY         = 4 * tileSize,
        rows            = 5,
        cols            = 11,
        count           = rows * cols,
        spawned         = 0,
        alive           = 0,
        canFire         = true,
        bulletSpeed     = 8,
        hero            = null,
        spriteImg       = '/img/enemies-and-hero.png',
        leftBarrier     = null,
        rightBarrier    = null,
        lastTick        = null,
        elapsed         = 0,
        interval        = 250,
        stepSize        = tileSize / 4,
        direction       = 1,
        aliens          = null,
        sweepRow        = 4,
        stepDown        = 0;

    require('games/spaceinvaders/characters');

    Crafty.init(worldWidth, worldHeight);
    Crafty.canvas.init();

    //--------------------------------------------------------------------------
    //
    // Setup
    //
    //--------------------------------------------------------------------------

    //----------------------------------
    //
    // Sprites
    //
    //----------------------------------

    Crafty.sprite(tileSize, spriteImg, {
        alien1: [0, 0],
        alien2: [0, 1],
        alien3: [0, 2],
        hero:   [0, 3]
    });

    //----------------------------------
    //
    // Characters
    //
    //----------------------------------


    Crafty.c('Hero', {
        init: function () {
            this.requires('2D, Canvas, Multiway, Collision, hero')
                .attr({
                    x: worldWidth / 2 - tileSize / 2,
                    y: tileSize * 15
                })
                .multiway(4, {
                    LEFT_ARROW: 180,
                    RIGHT_ARROW: 0
                })
                .bind('Moved', function (from) {
                    if ((from.x + tileSize) >= worldWidth) {
                        this.attr({x: from.x - 1});
                    }
                    if (from.x <= 0) {
                        this.attr({x: 1});
                    }
                })
                .bind('KeyDown', function (event) {
                    if (event.key === Crafty.keys.SPACE && canFire) {
                        canFire = false;
                        Crafty.e('Bullet, 2D, Canvas, Color, Collision')
                            .color('rgb(0,255,0)')
                            .attr({
                                x: this.x + tileSize / 2 - 1,
                                y: this.y - 18,
                                w: 2,
                                h: 16
                            })
                            .bind('EnterFrame', function () {
                                if (this.y > 0) {
                                    this.y -= bulletSpeed;
                                } else {
                                    this.destroy();
                                    canFire = true;
                                }
                            })
                            .onHit('Alien', function (hits) {
                                hits[0].obj.kill();
                                this.destroy();
                                canFire = true;
                            });
                    }
                });
            return this;
        }
    });

    //--------------------------------------------------------------------------
    //
    // World
    //
    //--------------------------------------------------------------------------

    function spawnAlien(i, j, callback) {
        var alien, anim, row, start, end, delay = 0, half, spawn;
        if (!aliens[j]) {
            aliens[j] = [];
        }

        switch (j) {
        case 0:
            alien = 'alien2';
            row = 1;
            break;
        case 1:
        case 2:
            alien = 'alien1';
            row = 0;
            break;
        case 3:
        case 4:
            alien = 'alien3';
            row = 2;
            break;
        default:
            alien = 'alien3';
            row = 2;
        }

        spawn = Crafty.e('Alien, ' + alien)
            .Alien(row)
            .attr({
                x: i * tileSize + offsetX,
                y: j * tileSize + offsetY
            });

        aliens[j][i] = spawn;
        spawned += 1;

        if (spawned < count) {
            if (i < cols - 1) {
                i += 1;
            } else {
                i = 0;
                j -= 1;
            }
            setTimeout(function () {
                spawnAlien(i, j, callback);
            }, 30);
        } else {
            callback();
        }
    }

    function createBarrier() {
        return Crafty.e('2D, Canvas, Color, Collision')
            .color(Crafty.toRGB('#FFFFFF'))
            .attr({
                w: 16,
                h: worldHeight
            });
            // .onHit('Alien', function (hits) {
            //     direction *= -1;
            //     stepDown = 5;
            // });
    }

    function start() {
        console.log('start!');
    }

    function reset() {
        aliens = [];
        spawned = 0;
        spawnAlien(0, 4, start);
    }


    function generateWorld() {
        // leftBarrier = createBarrier();
        // rightBarrier = createBarrier().attr({x: worldWidth - 16});
        reset();
    }

    //--------------------------------------------------------------------------
    //
    // Scenes
    //
    //--------------------------------------------------------------------------

    Crafty.scene('loading', function () {
        Crafty.load([spriteImg], function () {
            Crafty.scene('main');
        });
        Crafty.e('2D, Canvas, Text')
            .attr({w: 640, h: 480, x: 5, y: 5})
            .text('loading...');
        Crafty.background('black');
    });

    var game = Crafty.scene('main', function () {
        generateWorld();
        Crafty.background('black');
        this.bind('Click', function () {
            console.log('click!');
        });
        // lastTick = Date.now();
        // this.bind('EnterFrame', function () {
        //     var now = Date.now(), elapsed = now - lastTick;
        //     if (elapsed >= interval) {
        //         var row = aliens[sweepRow], i =0, l = row.length, alien, x, y;
        //         for (; i < l; i += 1) {
        //             alien = row[i];
        //             x = alien.x;
        //             y = alien.y;
        //             if (stepDown < 0) {
        //                 x = x + (tileSize * direction);
        //                 y = y - tileSize;
        //             } else {
        //                 x = x + (stepSize * direction);
        //             }
        //             alien.toggle();
        //             alien.attr({x: x, y: y});
        //         }

        //         if (stepDown < 0) {
        //             stepDown -= 1;
        //         }
        //         if (sweepRow === 0) {
        //             sweepRow = 4;
        //         } else {
        //             sweepRow -= 1;
        //         }
        //         lastTick = now;
        //     }
        // });
    });

    //--------------------------------------------------------------------------
    //
    // Kick off
    //
    //--------------------------------------------------------------------------

    Crafty.scene('loading');

});
