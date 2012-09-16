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
    // OneD
    //
    //--------------------------------------------------------------------------

    module('OneD', {
        setup: function () {
            source = [0, 1, 2, 3, 4, null, NaN, undefined]; // length = 8, truly = 5, falsy = 3
        }
    });

    test('OneD Arrays', function () {

        ok(ArrayUtils.OneD, 'ArrayUtils.OneD constructor.');

        var oneDInstance = new ArrayUtils.OneD(source);
        ok(oneDInstance, 'OneD instance.');

        // Length
        equal(oneDInstance.length(), 8, 'lengh()');

        // [] operator proxy :(
        equal(oneDInstance.at(1), 1, 'at()');
        var added = oneDInstance.addAt(0, 100);
        equal(added, 100, 'addAt()');
        equal(oneDInstance.at(0), 100, 'addAt()');
        oneDInstance.addAt(0, 0);

        // Etc
        deepEqual(oneDInstance.toArray(), source, 'toArray()');

        // Replace source
        var newSource = [2, 3, 4, 5]; // length = 4;
        oneDInstance.setSource(newSource);
        equal(oneDInstance.length(), 4, 'setSource()');
        oneDInstance.push(6);
        equal(oneDInstance.at(4), 6, 'setSource()');
        oneDInstance.setSource(source);

        oneDInstance.unshift(10);
        var deleted = oneDInstance.deleteAt(0);
        ok(_.isUndefined(oneDInstance.at(0)), 'deleteAt()');
        equal(deleted, 10, 'deleteAt()');
        oneDInstance.shift();

        // Count
        equal(oneDInstance.countTruly(), 5, 'countTruly()');
        equal(oneDInstance.countFalsy(), 3, 'countFalsy()');

        // Random
        var index = oneDInstance.getRandomIndex();
        ok((index >= 0), 'getRandomIndex()');
        ok((index < oneDInstance.length()), 'getRandomIndex()');

        // Trulys
        oneDInstance.unshift(null);
        equal(oneDInstance.firstTruly(), 0, 'firstTruly()');
        equal(oneDInstance.lastTruly(), 4, 'lastTruly()');
        oneDInstance.shift();

    });

    //--------------------------------------------------------------------------
    //
    // TwoD
    //
    //--------------------------------------------------------------------------

    module('TwoD', {
        setup: function () {
            source = [
                1,  2,  3,  4,  5, 6,  7,  8,  9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20
            ]; // length = 20
        }
    });

    test('TwoD', function () {
        // Indirect testing of private TwoD prototype.

        // Errors
        throws(function () {
            var twoD = new ArrayUtils.RowMajor();
        }, ReferenceError, 'TwoD ReferenceError: rows.');
        throws(function () {
            var twoD = new ArrayUtils.RowMajor(1);
        }, ReferenceError, 'TwoD ReferenceError: columns.');
        throws(function () {
            var twoD = new ArrayUtils.RowMajor('foo', 'bar');
        }, TypeError, 'TwoD TypeError: rows.');
        throws(function () {
            var twoD = new ArrayUtils.RowMajor(1, 'bar');
        }, TypeError, 'TwoD TypeError: columns.');
        throws(function () {
            var twoD = new ArrayUtils.RowMajor(0, 0);
        }, Error, 'TwoD Error: rows.');
        throws(function () {
            var twoD = new ArrayUtils(1, 0);
        }, Error, 'TwoD Error: columns.');

        // Rows and columns
        var twoD = new ArrayUtils.RowMajor(1, 1);
        equal(twoD.rows, 1, 'TwoD rows.');
        equal(twoD.columns, 1, 'TwoD columns.');
    });

    test('RowMajor', function () {
        // RowMajor:
        //  1  2  3  4  5
        //  6  7  8  9 10
        // 11 12 13 14 15
        // 16 17 18 19 20

        // Basic
        ok(ArrayUtils.RowMajor, 'RowMajor constructor.');
        var rowMajorInstance = new ArrayUtils.RowMajor(4, 5, source);
        ok(rowMajorInstance, 'RowMajor instance.');
        equal(rowMajorInstance.length(), 20, 'RowMajor inheritance.');

        // Rows and columns
        deepEqual(rowMajorInstance.getRow(0).toArray(), [1, 2, 3, 4, 5], 'getRow(0)');
        deepEqual(rowMajorInstance.getRow(1).toArray(), [6, 7, 8, 9, 10], 'getRow(1)');
        deepEqual(rowMajorInstance.getRow(2).toArray(), [11, 12, 13, 14, 15], 'getRow(2)');
        deepEqual(rowMajorInstance.getRow(3).toArray(), [16, 17, 18, 19, 20], 'getRow(3)');
        deepEqual(rowMajorInstance.getColumn(0).toArray(), [1, 6, 11, 16], 'getColumn(0)');
        deepEqual(rowMajorInstance.getColumn(1).toArray(), [2, 7, 12, 17], 'getColumn(1)');
        deepEqual(rowMajorInstance.getColumn(2).toArray(), [3, 8, 13, 18], 'getColumn(2)');
        deepEqual(rowMajorInstance.getColumn(3).toArray(), [4, 9, 14, 19], 'getColumn(3)');
        deepEqual(rowMajorInstance.getColumn(4).toArray(), [5, 10, 15, 20], 'getColumn(4)');

        // Offets
        equal(rowMajorInstance.getOffset(0, 1), 1, 'getOffset(0, 1)');
        equal(rowMajorInstance.getOffset(1, 3), 8, 'getOffset(1, 3)');
        equal(rowMajorInstance.getOffset(3, 4), 19, 'getOffset(3, 4)');

        // at, addAt, deleteAt
        equal(rowMajorInstance.at(1, 3), 9, 'at(1, 3)');
        equal(rowMajorInstance.deleteAt(1, 3), 9, 'deleteAt(1, 3)');
        ok(_.isUndefined(rowMajorInstance.at(1, 3)), 'deleteAt(1, 3)');
        equal(rowMajorInstance.addAt(1, 3, 9), 9, 'addAt(1, 3, 9)');
        rowMajorInstance.deleteAt(1, 3);
        rowMajorInstance.addAt(1, 3, 9);
        equal(rowMajorInstance.at(1, 3), 9, 'addAt(1, 3, 9)');

    });

    test('ColumnMajor', function () {
        // ColumnMajor
        //  1  5  9 13 17
        //  2  6 10 14 18
        //  3  7 11 15 19
        //  4  8 12 16 20

        // Basic
        ok(ArrayUtils.ColumnMajor, 'ColumnMajor constructor.');
        var columnMajorInstance = new ArrayUtils.ColumnMajor(4, 5, source);
        ok(columnMajorInstance, 'ColumnMajor instance.');
        equal(columnMajorInstance.length(), 20, 'ColumnMajor inheritance.');

        // Rows and columns
        deepEqual(columnMajorInstance.getRow(0).toArray(), [1, 5, 9, 13, 17], 'getRow(0)');
        deepEqual(columnMajorInstance.getRow(1).toArray(), [2, 6, 10, 14, 18], 'getRow(1)');
        deepEqual(columnMajorInstance.getRow(2).toArray(), [3, 7, 11, 15, 19], 'getRow(2)');
        deepEqual(columnMajorInstance.getRow(3).toArray(), [4, 8, 12, 16, 20], 'getRow(3)');
        deepEqual(columnMajorInstance.getColumn(0).toArray(), [1, 2, 3, 4], 'getColumn(0)');
        deepEqual(columnMajorInstance.getColumn(1).toArray(), [5, 6, 7, 8], 'getColumn(1)');
        deepEqual(columnMajorInstance.getColumn(2).toArray(), [9, 10, 11, 12], 'getColumn(2)');
        deepEqual(columnMajorInstance.getColumn(3).toArray(), [13, 14, 15, 16], 'getColumn(3)');
        deepEqual(columnMajorInstance.getColumn(4).toArray(), [17, 18, 19, 20], 'getColumn(4)');

        // Offsets
        equal(columnMajorInstance.getOffset(0, 1), 4, 'getOffset(0, 1)');
        equal(columnMajorInstance.getOffset(1, 3), 13, 'getOffset(1, 3)');
        equal(columnMajorInstance.getOffset(3, 4), 19, 'getOffset(3, 4)');

        // at, addAt, deleteAt
        equal(columnMajorInstance.at(1, 3), 14, 'at(1, 3)');
        equal(columnMajorInstance.deleteAt(1, 3), 14, 'deleteAt(1, 3)');
        ok(_.isUndefined(columnMajorInstance.at(1, 3)), 'deleteAt(1, 3)');
        equal(columnMajorInstance.addAt(1, 3, 14), 14, 'addAt(1, 3, 14)');
        columnMajorInstance.deleteAt(1, 3);
        columnMajorInstance.addAt(1, 3, 14);
        equal(columnMajorInstance.at(1, 3), 14, 'addAt(1, 3, 14)');

    });
});
