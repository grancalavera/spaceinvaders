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
                case Crafty.keys['1']:
                    this.trigger('weapon:classic');
                    break;
                case Crafty.keys['2']:
                    this.trigger('weapon:laser');
                    break;
                case Crafty.keys.P:
                    this.trigger('pause');
                    break;
                // Debugging:
                case Crafty.keys.R:
                    this.trigger('killRow');
                    break;
                case Crafty.keys.F:
                    this.trigger('alienFire');
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
