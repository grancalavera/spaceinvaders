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
            return this.initWithKeybard();
        },
        Controls: function () {
            return this;
        },
        initWithKeybard: function () {
            this.requires('Keyboard');
            this.bind('KeyDown', function (event) {
                switch (event.key) {
                case Crafty.keys.SPACE:
                    this.trigger('fire');
                    break;
                case Crafty.keys.LEFT_ARROW:
                    this.trigger('left');
                    break;
                case Crafty.keys.RIGHT_ARROW:
                    this.trigger('right');
                    break;
                }
            }).bind('KeyUp', function (event) {
                var key = event.key;
                if (!this.isDown('LEFT_ARROW') && !this.isDown('RIGHT_ARROW')) {
                    this.trigger('stop');
                }
            });
            return this;
        }
    });
});
