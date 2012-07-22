define(function (require) {
    'use strict';

    var Crafty = require('crafty'),
        tileSize    = 16,
        worldWidth  = 25,
        worldHeight = 21;

    Crafty.init(tileSize * worldWidth, tileSize * worldHeight);

    function generateWorld() {
        var i, j, grass;
        for (i = 0; i < worldWidth; i += 1) {
            for (j = 0; j < worldHeight; j += 1) {
                grass = 'grass' + Crafty.math.randomInt(1, 4);
                Crafty.e('2D, DOM, ' + grass).
                    attr({
                        x: i * tileSize,
                        y: j * tileSize,
                        z: 1
                    });
            }
        }
    }

    Crafty.scene('loading', function () {
        Crafty.load(['/img/joystick.png'], function () {
            Crafty.scene('main');
        });
        Crafty.background('#333');
        Crafty.e('2D, DOM, Text')
            .attr({
                w: 100,
                h: 20,
                x: 150,
                y: 120
            })
            .text('Loading')
            .css({'text-align': 'center'});
    });

    Crafty.sprite(tileSize, '/img/bananabomber-sprites.png', {
        grass1: [0, 0],
        grass2: [1, 0],
        grass3: [2, 0],
        grass4: [3, 0],
        flower: [0, 1],
        bush1:  [0, 2],
        bush2:  [1, 2],
        player: [0, 3],
        enemy:  [0, 3],
        banana: [4, 0],
        empty:  [4, 0]
    });

    Crafty.scene('main', function () {
        generateWorld();
    });

    Crafty.scene('loading');
});
