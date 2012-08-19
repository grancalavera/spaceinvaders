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
    // HeroBullet
    //
    //--------------------------------------------------------------------------

    Crafty.c('HeroBullet', {
        speed: 1,
        init: function () {
            this.requires('2D, Canvas, Collision, Color')
                .color('rgb(0, 255, 0)')
                .attr({w: 2, h: 16})
                .bind('EnterFrame', function () {
                    if (this.y > 0) {
                        this.y -= this.speed;
                    } else {
                        this.destroy();
                        this.trigger('destroy');
                    }
                });
            return this;
        },
        HeroBullet: function (x, y) {
            return this.attr({x: y, y: y});
        }
    });

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
        direction: 0,
        speed: 5,
        init: function () {
            this.requires('2D, Canvas, Collision, Tween, hero');
            return this;
        },
        Hero: function (ww, wh, ts) {
            this.attr({x: -ts, y: ts * 15});
            this.startX = ww / 2 - ts / 2;
            this.tween({x: this.startX}, 30).bind('TweenEnd', function (property) {
                this.timeout(function () {
                    this.trigger('ready');
                }, 300);
            });
            return this;
        },
        start: function () {
            this.bind('EnterFrame', function () {
                var x = this.x;
                if (this.direction === 1 || this.direction === -1) {
                    x = x + (this.speed * this.direction);
                    this.attr({x: x});
                }
            });

            return this;
        },
        setDirection: function (direction) {
            if (direction !== this.direction) {
                this.direction = direction;
            }
            return this;
        }
    });
});
