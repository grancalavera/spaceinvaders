/**
 * Characters
 *
 * Adds the game charactes to Crafty as components. Depends on the game sprite
 * being previously created.
 *
 * @author leoncoto@gmail.com
 */
define(function (require) {

    'use strict';

    var Crafty = require('crafty');

    //--------------------------------------------------------------------------
    //
    // Alien
    //
    //--------------------------------------------------------------------------

    Crafty.c('Alien', {
        delay: 500,
        animation: 'flip',
        init: function () {
            this.requires('2D, Canvas, SpriteAnimation, Alien, Collision');
            return this;
        },
        Alien: function (row) {
            this
                .animate('explode', 2, 0, 2)
                .animate('flip', 0, row, 1)
                .animate('flop', 1, row, 0);
            return this;
        },
        kill: function () {
            alive -= 1;
            this
                .animate('explode', 1)
                .timeout(function () {
                    this.destroy();
                }, 250);
            return this;
        },
        toggle: function () {
            this.animate(this.animation, 1, 1).stop();
            this.animation = this.animation === 'flip' ? 'flop' : 'flip';
            return this;
        }
    });
});
