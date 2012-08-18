/**
 * Controls
 *
 * Keyboard controls for Space Invaders
 *
 * @author leoncoto@gmail.com
 */
define(function (require) {

    'use strict';

    //--------------------------------------------------------------------------
    //
    // Dependencies
    //
    //--------------------------------------------------------------------------

    var _           = require('underscore'),
        Crafty      = require('crafty');

    //--------------------------------------------------------------------------
    //
    // Controls
    //
    //--------------------------------------------------------------------------

    Crafty.c('Controls', {
        init: function () {
            this.requires('Keyboard');
            this.bind('KeyDown', function (event) {
                if (this.isDown('SPACE')) {
                    this.trigger('fire');
                }
                if (this.isDown('LEFT_ARROW')) {
                    this.trigger('left');
                } else if (this.isDown('RIGHT_ARROW')) {
                    this.trigger('right');
                }
            });
            return this;
        },
        Controls: function () {
            return this;
        }
    });
});
