define(function (require) {
    'use strict';

    var Crafty = require('crafty'),
        tileSize    = 16,
        worldWidth  = 25,
        worldHeight = 21;

    Crafty.init(tileSize * worldWidth, tileSize * worldHeight);

    function makeFlower(i, j) {
        return Crafty.e('2D, DOM, flower, solid, SpriteAnimation, explodable')
            .attr({
                x: i * tileSize,
                y: j * tileSize,
                z: 1000
            })
            .animate('wind', 0, 1, 3)
            .animate('wind', 80, -1)
            .bind('explode', function () {
                this.destroy();
            });
    }

    function generateWorld() {
        var i, j, grass, bush, flower;
        for (i = 0; i < worldWidth; i += 1) {
            for (j = 0; j < worldHeight; j += 1) {

                // Grass
                grass = 'grass' + Crafty.math.randomInt(1, 4);
                Crafty.e('2D, DOM, ' + grass).
                    attr({
                        x: i * tileSize,
                        y: j * tileSize,
                        z: 1
                    });

                // Fence of bushes
                if (i === 0 || i === 24 || j === 0 || j === 20) {
                    bush = 'bush' + Crafty.math.randomInt(1, 2);
                    Crafty.e('2D, DOM, solid, ' + bush).
                        attr({
                            x: i * tileSize,
                            y: j * tileSize,
                            z: 2
                        });
                }

                // Nice flowers
                if (i > 0
                        && i < 24
                        && j > 0
                        && j < 20
                        && (Crafty.math.randomInt(0, 50) > 30)
                        && !(i === 1 && j >= 16)
                        && !(i === 23 && j <= 4)) {
                    flower = makeFlower(i, j);
                }

                // Grid of bushes
                if ((i % 2 === 0) && (j % 2 === 0)) {
                    Crafty.e('2D, DOM, solid, bush1')
                        .attr({
                            x: i * tileSize,
                            y: i * tileSize,
                            z: 2000
                        });
                }
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
