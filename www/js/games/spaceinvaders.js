define(function (require) {
    'use strict';

    var Crafty = require('crafty'),
        worldWidth  = 480,
        worldHeight = 640,
        tileSize    = 32,
        offsetX     = 2 * tileSize,
        offsetY     = 4 * tileSize,
        rows        = 5,
        cols        = 11,
        count       = rows * cols,
        spawned     = 0,
        alive       = 0,
        canFire     = true,
        bulletSpeed = 8,
        hero        = null,
        spriteImg   = '/img/enemies-and-hero.png';

    //--------------------------------------------------------------------------
    //
    // Setup
    //
    //--------------------------------------------------------------------------

    Crafty.init(worldWidth, worldHeight);

    //--------------------------------------------------------------------------
    //
    // Characters
    //
    //--------------------------------------------------------------------------

    Crafty.sprite(tileSize, spriteImg, {
        alien1: [0, 0],
        alien2: [0, 1],
        alien3: [0, 2],
        hero:   [0, 3]
    });

    Crafty.c('Alien', {
        init: function () {
            this.requires('2D, DOM, SpriteAnimation, Alien, Collision');
            return this;

        },
        Alien: function () {
            this
                .animate('explode', 2, 0, 2)
                .animate('even', 0, 0, 0)
                .animate('odd', 1, 0, 1);
            return this;
        },
        kill: function () {
            alive -= 1;
            this
                .animate('explode', 1)
                .timeout(function () {
                    this.destroy();
                }, 250);
            if (alive === 0) {
                restart();
            }
            return this;
        }
    });

    Crafty.c('Hero', {
        init: function () {
            this.requires('2D, DOM, Multiway, Collision, hero')
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
                        Crafty.e('Bullet, 2D, DOM, Color, Collision')
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

    function spawnHero() {
        hero = Crafty.e('Hero');
    }

    function spawnAlien(i, j) {
        var alien;

        switch (j) {
        case 0:
            alien = 'alien2';
            break;
        case 1:
        case 2:
            alien = 'alien1';
            break;
        case 3:
        case 4:
            alien = 'alien3';
            break;
        default:
            alien = 'alien3';
        }

        Crafty.e('Alien, ' + alien)
            .attr({
                x: i * tileSize + offsetX,
                y: j * tileSize + offsetY
            }).Alien();

        spawned += 1;

        if (spawned < count) {
            if (i < cols - 1) {
                i += 1;
            } else {
                i = 0;
                j -= 1;
            }
            setTimeout(function () {
                spawnAlien(i, j);
            }, 10);
        } else {
            spawnHero();
        }
    }


    function restart() {
        alive = count;
        spawned = 0;
        if (hero) {
            hero.destroy();
            hero = null;
        }
        spawnAlien(0, 4);
    }

    function generateWorld() {
        restart();
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
        Crafty.e('2D, DOM, Text')
            .attr({w: 640, h: 480, x: 5, y: 5})
            .text('loading...')
            .css('color', 'white')
            .css('font-family', 'monospace');
        Crafty.background('black');
    });

    Crafty.scene('main', function () {
        generateWorld();
        Crafty.background('black');
    });

    //--------------------------------------------------------------------------
    //
    // Kick off
    //
    //--------------------------------------------------------------------------

    Crafty.scene('loading');

});
