define(function (require) {
    'use strict';
    var _ = require('underscore'),
        ArrayUtils = require('arrayutils'),
        source;

    //--------------------------------------------------------------------------
    //
    // Module
    //
    //--------------------------------------------------------------------------

    module('ArrayUtils');

    test('ArrayUtils module.', 1, function () {
        ok(ArrayUtils, 'ArrayUtils module.');
    });

    //--------------------------------------------------------------------------
    //
    // Basic Utils
    //
    //--------------------------------------------------------------------------

    module('BasicUtils', {
        setup: function () {
            source = [0, 1, 2, 3, 4, null, NaN, undefined];
        }
    });

    test('BasicUtils instance.', 3, function () {
        var basicUtils = ArrayUtils.basicUtils();
        ok(basicUtils, 'BasicUtils instance.');
        basicUtils = ArrayUtils.basicUtils(source);
        ok(basicUtils, 'BasicUtils instance with source.');
        equal(basicUtils, source, 'Original source integrity.');
    });

    test('BasicUtils methods.', 5, function () {
        var index, element, basicUtils = ArrayUtils.basicUtils(source);
        equal(basicUtils.countTruly(), 5, 'countTruly()');
        equal(basicUtils.countFalsy(), 3, 'countFalsy()');
        index = basicUtils.getRandomIndex();
        ok((index >= 0), 'getRandomIndex()');
        ok((index < basicUtils.length), 'getRandomIndex()');
        ok(_.include(basicUtils, basicUtils.getRandomElement()), 'getRandomElement()');
    });

    //--------------------------------------------------------------------------
    //
    // 2D Arrays
    //
    //--------------------------------------------------------------------------

    module('2D Arrays', {
        setup: function () {
            source = [
                1,  2,  3,  4,  5, 6,  7,  8,  9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20
            ];
        }
    });

    test('RowMajor', function () {
        var rowMajor = ArrayUtils.rowMajor(4, 5, source);

        ok(rowMajor, 'RowMajor instance.');

        // RowMajor:
        //  1  2  3  4  5
        //  6  7  8  9 10
        // 11 12 13 14 15
        // 16 17 18 19 20

        deepEqual(rowMajor.getRow(0), [1, 2, 3, 4, 5], 'getRow(0)');
        deepEqual(rowMajor.getRow(1), [6, 7, 8, 9, 10], 'getRow(1)');
        deepEqual(rowMajor.getRow(2), [11, 12, 13, 14, 15], 'getRow(2)');
        deepEqual(rowMajor.getRow(3), [16, 17, 18, 19, 20], 'getRow(3)');

        deepEqual(rowMajor.getColumn(0), [1, 6, 11, 16], 'getColumn(0)');
        deepEqual(rowMajor.getColumn(1), [2, 7, 12, 17], 'getColumn(1)');
        deepEqual(rowMajor.getColumn(2), [3, 8, 13, 18], 'getColumn(2)');
        deepEqual(rowMajor.getColumn(3), [4, 9, 14, 19], 'getColumn(3)');
        deepEqual(rowMajor.getColumn(4), [5, 10, 15, 20], 'getColumn(4)');
    });

    test('ColumnMajor', function () {
        var columnMajor = ArrayUtils.columnMajor(4, 5, source);

        ok(columnMajor, 'ColumnMajor instance.');

        // ColumnMajor
        //  1  5  9 13 17
        //  2  6 10 14 18
        //  3  7 11 15 19
        //  4  8 12 16 20

        deepEqual(columnMajor.getRow(0), [1, 5, 9, 13, 17], 'getRow(0)');
        deepEqual(columnMajor.getRow(1), [2, 6, 10, 14, 18], 'getRow(1)');
        deepEqual(columnMajor.getRow(2), [3, 7, 11, 15, 19], 'getRow(2)');
        deepEqual(columnMajor.getRow(3), [4, 8, 12, 16, 20], 'getRow(3)');

        deepEqual(columnMajor.getColumn(0), [1, 2, 3, 4], 'getColumn(0)');
        deepEqual(columnMajor.getColumn(1), [5, 6, 7, 8], 'getColumn(1)');
        deepEqual(columnMajor.getColumn(2), [9, 10, 11, 12], 'getColumn(2)');
        deepEqual(columnMajor.getColumn(3), [13, 14, 15, 16], 'getColumn(3)');
        deepEqual(columnMajor.getColumn(4), [17, 18, 19, 20], 'getColumn(4)');
    });
});
