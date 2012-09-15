/**
 * RowMajorArray
 *
 * An array extension to allow 2D arrays to be stored in a linear array.
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

    var _ = require('underscore');

    //--------------------------------------------------------------------------
    //
    // Helpers
    //
    //--------------------------------------------------------------------------


    /**
     * isFalsy
     *
     * All falsy values but 0.
     */
    function isFalsy(value) {
        return _.isUndefined(value) || _.isNull(value) || _.isNaN(value);
    }

    function count(array, countFalsy) {
        var condition;
        return _.reduce(array, function (memo, item) {
            condition = isFalsy(item);
            if (countFalsy) {
                condition = !condition;
            }
            return memo + (condition ? 0 : 1);
        }, 0, array);
    }

    function getConsecutive(array, anchor, count) {
        var start = anchor * count, end = start + count;
        return array.slice(start, end);
    }

    function getNonConsecutive(array, anchor, countA, countB) {
        var result = [], i = 0;
        for (i; i < countA; i += 1) {
            result.push(array[anchor + (countB * i)]);
        }
        return result;
    }

    //--------------------------------------------------------------------------
    //
    // BasicUtils
    //
    //--------------------------------------------------------------------------

    var BasicUtils = {
        countTruly: function () {
            return count(this);
        },
        countFalsy: function () {
            return count(this, true);
        },
        getRandomIndex: function () {
            return Math.floor(Math.random() * this.length);
        },
        getRandomElement: function () {
            return this[this.getRandomIndex()];
        }
    };

    var TwoD = {
        rows: 0,
        columns: 0,
        init: function (rows, columns) {
            this.rows = rows;
            this.columns = columns;
        }
    };

    var RowMajor = {
        getRow: function (row) {
            return getConsecutive(this, row, this.columns);
        },
        getColumn: function (column) {
            return getNonConsecutive(this, column, this.rows, this.columns);
        }
    };

    var ColumnMajor = {
        getRow: function (row) {
            return getNonConsecutive(this, row, this.columns, this.rows);
        },
        getColumn: function (column) {
            return getConsecutive(this, column, this.rows);
        }
    };

    //--------------------------------------------------------------------------
    //
    // Exports
    //
    //--------------------------------------------------------------------------

    return {
        basicUtils: function (source) {
            var array = source || [];
            _.extend(array, BasicUtils);
            return array;
        },
        rowMajor: function (rows, columns, source) {
            var array = source || [];
            _.extend(array, BasicUtils, TwoD, RowMajor);
            array.init(rows, columns);
            return array;
        },
        columnMajor: function (rows, columns, source) {
            var array = source || [];
            _.extend(array, BasicUtils, TwoD, ColumnMajor);
            array.init(rows, columns);
            return array;
        }
    };
});
