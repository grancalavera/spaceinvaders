/**
 * Hero
 *
 * The cannon that fires to the aliens
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
    // Hero
    //
    //--------------------------------------------------------------------------

    Crafty.c('Hero', {
        ww: 0,
        wh: 0,
        ts: 0,
        startX: 0,
        init: function () {
            this.requires('2D, Canvas, Collision, Tween, hero');
            return this;
        },
        Hero: function (ww, wh, ts) {
            this.attr({x: -ts, y: ts * 15});
            this.startX = ww / 2 - ts / 2;
            return this;
        },
        start: function () {
            this.tween({x: this.startX}, 30).bind('TweenEnd', function (property) {
                this.trigger('ready');
            });
            return this;
        }
    });
});
