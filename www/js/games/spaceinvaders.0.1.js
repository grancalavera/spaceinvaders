define(function (require) {
    'use strict';
    var Crafty = require('crafty'),
        _ = require('underscore');


    //--------------------------------------------------------------------------
    //
    // Game set up
    //
    //--------------------------------------------------------------------------
    var renderMode = 'Canvas',
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
        sprite = '/img/enemies-and-hero.png';

    //--------------------------------------------------------------------------
    //
    // Game components
    //
    //--------------------------------------------------------------------------

    require('games/spaceinvaders/aliens');
    require('games/spaceinvaders/controls');
    require('games/spaceinvaders/hero');

    //--------------------------------------------------------------------------
    //
    // Sprites
    //
    //--------------------------------------------------------------------------

    Crafty.sprite(ts, sprite, {
        alienTop:    [0, 0],
        alienMiddle: [0, 1],
        alienBottom: [0, 2],
        hero:        [0, 3]
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
        var cloud, hero, controls,
            LEFT = -1, RIGHT = 1, STOP = 0;
        Crafty.background('black');

        function start() {
            hero.start();
            cloud.start();
            controls = Crafty.e('Controls')
                .bind('left', function () {
                    hero.setDirection(LEFT);
                }).bind('right', function () {
                    hero.setDirection(RIGHT);
                }).bind('fire', function () {
                    console.log('fire');
                }).bind('stop', function () {
                    hero.setDirection(STOP);
                });
        }

        cloud = Crafty.e('AlienCloud').AlienCloud(rows, cols, ox, oy, ww, wh, ts);
        cloud.bind('ready', function () {
            hero = Crafty.e('Hero').Hero(ww, wh, ts);
            hero.bind('ready', function () {
                start();
            });
        });


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
