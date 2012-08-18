define(function (require) {
    'use strict';
    var Crafty = require('crafty'),
        _ = require('underscore');

    require('games/spaceinvaders/aliens');
    require('games/spaceinvaders/controls');

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
    // Sprites
    //
    //--------------------------------------------------------------------------

    Crafty.sprite(ts, sprite, {
        hero:   [0, 3]
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
            .AlienCloud(rows, cols, ox, oy, ww, wh, ts, sprite),
            controls = Crafty.e('Controls');
        Crafty.background('black');

        controls.bind('left', function () {
            console.log('move left');
        }).bind('right', function () {
            console.log('move right');
        }).bind('fire', function () {
            console.log('fire');
        });

        cloud.bind('ready', function () {
            cloud.start();
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
