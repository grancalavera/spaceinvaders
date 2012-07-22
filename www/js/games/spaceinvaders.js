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
        spawned     = 0;

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

    Crafty.sprite(tileSize, '/img/enemies-and-hero.png', {
        alien1: [0, 0],
        alien2: [0, 1],
        alien3: [0, 2],
        hero:   [0, 3]
    });

    //--------------------------------------------------------------------------
    //
    // World
    //
    //--------------------------------------------------------------------------

    function spawnHero() {
        Crafty.e('2D, DOM, Multiway, Collision, hero')
            .attr({
                x: 1,
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
                if (from.x <=0) {
                    this.attr({x: 1});
                }
            })
            .onHit('fire', function () {
                this.destroy();
            });
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

        Crafty.e('2D, DOM, SpriteAnimation, enemy, ' + alien)
            .attr({
                x: i * tileSize + offsetX,
                y: j * tileSize + offsetY,
                z: 2
            });

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
        Crafty.scene('main');
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
