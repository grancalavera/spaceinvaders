define(function (require) {
    'use strict';

    var Crafty = require('crafty'),
        tileSize    = 16,
        worldWidth  = 25,
        worldHeight = 21;

    Crafty.init(tileSize * worldWidth, tileSize * worldHeight);

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

    function makeBanana(i, j) {
        return Crafty.e('2D, DOM, banana, fire, explodable')
            .attr({
                x: i * tileSize,
                y: j * tileSize,
                z: 1000
            });
    }

    function generateWorld() {
        var i, j, grass, bush;
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

                // Nice flowers or bananas
                if (i > 0
                        && i < 24
                        && j > 0
                        && j < 20
                        && (Crafty.math.randomInt(0, 50) > 30)
                        && !(i === 1 && j >= 16)
                        && !(i === 23 && j <= 4)) {

                    makeBanana(i, j);
                    // if (Math.random() > 0.5) {
                    // } else {
                    //     makeFlower(i, j);
                    // }

                }

                // Grid of bushes
                if ((i % 2 === 0) && (j % 2 === 0)) {
                    Crafty.e('2D, DOM, solid, bush1')
                        .attr({
                            x: i * tileSize,
                            y: j * tileSize,
                            z: 2000
                        });
                }


            }
        }
    }

    Crafty.c('LeftControls', {
        init: function () {
            this.requires('Multiway');
        },
        LeftControls: function (speed) {
            this.multiway(speed, {
                W: -90,
                S: 90,
                D: 0,
                A: 180
            });
            return this;
        }
    });

    Crafty.c('Ape', {
        changeAnimation: function (reelId) {
            this.stop().animate(reelId, 10, -1);
        },
        Ape: function () {
            this.requires('SpriteAnimation, Collision')
                .animate('walk_left', 6, 3, 8)
                .animate('walk_right', 9, 3, 11)
                .animate('walk_up', 3, 3, 5)
                .animate('walk_down', 0, 3, 2)
                .bind('NewDirection', function (direction) {
                    if (direction.x < 0 && !this.isPlaying('walk_left')) {
                        this.changeAnimation('walk_left');
                    }
                    if (direction.x > 0 && !this.isPlaying('walk_right')) {
                        this.changeAnimation('walk_right');
                    }
                    if (direction.y < 0 && !this.isPlaying('walk_up')) {
                        this.changeAnimation('walk_up');
                    }
                    if (direction.y > 0 && !this.isPlaying('walk_down')) {
                        this.changeAnimation('walk_down');
                    }
                })
                .bind('Moved', function (from) {
                    if (this.hit('solid')) {
                        this.attr({x: from.x, y: from.y});
                    }
                })
                .onHit('fire', function () {
                    this.destroy();
                });
            return this;
        },
        _Ape: function () {
            this.requires('SpriteAnimation, Collision, Grid')
                .animate('walk_left', 6, 3, 8)
                .animate('walk_right', 9, 3, 11)
                .animate('walk_up', 3, 3, 5)
                .animate('walk_down', 0, 3, 2)
                .bind('NewDirection', function (direction) {
                    console.log(direction.x + ', ' + direction.y);

                    if (direction.x < 0) {
                        if (!this.isPlaying('walk_left')) {
                            this.stop().animate('walk_left', 10, -1);
                        }
                        if (direction.x > 0) {
                            if (!this.isPlaying('walk_right')) {
                                this.stop().animate('walk_right', 10, -1);
                            }
                        }
                        if (direction.y < 0) {
                            if (!this.isPlaying('walk_up')) {
                                this.stop().animate('walk_up', 10, -1);
                            }
                        }
                        if (direction.y > 0) {
                            if (!this.isPlaying('walk_down')) {
                                this.stop().animate('walk_down', 10, -1);
                            }
                        }
                        if (!this.direction.x && !this.direction.y) {
                            this.stop();
                        }
                    }
                })
                .bind('Moved', function (from) {
                    if (this.hit('solid')) {
                        this.attr({x: from.x, y: from.y});
                    }
                }).
                onHit('fire', function () {
                    this.destroy();
                });
            return this;
        }
    });

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

    Crafty.scene('main', function () {
        generateWorld();
        var player1 = Crafty.e('2D, DOM, player, LeftControls, Ape')
            .attr({
                x: 16,
                y: 304,
                z: 1
            })
            .LeftControls(1)
            .Ape();
    });

    Crafty.scene('loading');
});
