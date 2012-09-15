(function () {
    'use strict';
    QUnit.config.autostart = false;
    requirejs.config({
        baseUrl: '../www/js/lib',
        paths: {
            games: '../games',
            tests: '../../../tests'
        }
    });
    var preload = [
        // Libraries
        'underscore',
        'arrayutils',
        'tests/arrayutilstests'
    ];
    requirejs(preload, function () {
        QUnit.start();
    });
}());
