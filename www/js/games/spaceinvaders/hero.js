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
    // Weapons
    //
    //--------------------------------------------------------------------------

    Crafty.c('Weapon', {
        init: function () {
            this.requires('2D, Canvas, Collision, Color')
                .color('rgb(0, 255, 0)')
                .attr({w: 2})
                .bind('EnterFrame', function () {
                    if (this.y > 0) {
                        this.y -= this.speed;
                    } else {
                        this.destroy();
                        this.trigger('destroy');
                    }
                });
            return this;
        }
    });

    Crafty.c('ClassicWeapon', {
        speed: 8,
        init: function () {
            this.requires('Weapon');
        },
        Weapon: function (x, y) {
            this.onHit('Alien', function (hits) {
                hits[0].obj.kill();
                this.destroy();
            });
            return this.attr({x: x, y: y - 18, h: 16});
        }
    });

    Crafty.c('LaserWeapon', {
        speed: 16,
        init: function () {
            this.requires('Weapon');
        },
        Weapon: function (x, y) {
            this.onHit('Alien', function (hits) {
                hits[0].obj.kill();
            });
            return this.attr({x: x, y: y - 34, h: 32});
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
        bullet: null,
        weapon: 'Classic',
        init: function () {
            this.requires('2D, Canvas, Collision, Tween, hero');
            return this;
        },
        Hero: function (ww, wh, ts) {
            this.ww = ww;
            this.wh = wh;
            this.ts = ts;
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
        },
        setWeapon: function (weapon) {
            this.weapon = weapon;
            console.log('weapon: ' + weapon);
        },
        fire: function () {
            var self = this, x, y;
            if (this.bullet) {
                return;
            }
            x = (this.x + this.ts / 2) - 1;
            y = this.y;
            this.bullet = Crafty.e(this.weapon + 'Weapon').Weapon(x, y);
            this.bullet.bind('Remove', function () {
                self.bullet = null;
            });
        }
    });
});
