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

    var _ = require('underscore'), ArrayUtils;

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
    // ArrayUtils
    //
    //--------------------------------------------------------------------------

    ArrayUtils = {};

    var OneD = ArrayUtils.OneD = function (source) {
        this.source = source || [];
        _.each(Object.getOwnPropertyNames(Array.prototype), function (name) {
            var method = Array.prototype[name];
            if (typeof method === 'function') {
                this[name] = function () {
                    return method.apply(this.source, arguments);
                };
            }
        }, this);
    };

    _.extend(OneD.prototype, {
        source: null,
        length: function () {
            return this.source.length;
        },
        /**
         * at
         *
         * Returns the element at the given index
         */
        at: function (index) {
            return this.source[index];
        },
        /**
         * deleteAt
         *
         * Deletes an element at an index from the `source` array.
         */
        deleteAt: function () {

        },
        /**
         * `countTruly`
         *
         * Counts all the elements in the `source` Array that contain a truly value.
         * A value of 0 (zero) will be counted as truly.
         */
        countTruly: function () {
            return count(this.source);
        },
        /**
         * `countFalsy`
         *
         * Counts all the elements in the `source` Array that contain a falsy value.
         * A value of 0 (zero) will be counted as truly.
         */
        countFalsy: function () {
            return count(this.source, true);
        },
        /**
         * `getRandomIndex`
         *
         * Returns a random index within the length of the `source` Array. The index
         * can point to an element with a falsy value.
         */
        getRandomIndex: function () {
            return Math.floor(Math.random() * this.source.length);
        },
        /**
         * `getRandomElement`
         *
         * Returns a random element from the `source` Array. The element's value
         * can be a falsy value.
         */
        getRandomElement: function () {
            return this.source[this.getRandomIndex()];
        },
        /**
         * firstTruly
         *
         * Returns the first truly element from the `source` Array.
         * A value of 0 (zero) will be counted as truly.
         */
        firstTruly: function () {
            var el = null, lenght = this.source.length, i = 0;
            for (i; i < lenght; i += 1) {
                el = this.source[i];
                if (!isFalsy(el)) {
                    break;
                }
            }
            return el;
        },
        /**
         * lastTruly
         *
         * Returns the last truly element from the `source` Array.
         * A value of 0 (zero) will be counted as truly.
         */
        lastTruly: function () {
            var el = null, i = this.source.length - 1;
            for (i; i > -1; i -= 1) {
                el = this.source[i];
                if (!isFalsy(el)) {
                    break;
                }
            }
            return el;
        }

    });

    //--------------------------------------------------------------------------
    //
    // BasicUtils
    //
    //--------------------------------------------------------------------------

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

    return ArrayUtils;
    // return {
    //     basicUtils: function (source) {
    //         var array = source || [];
    //         _.extend(array, BasicUtils);
    //         return array;
    //     },
    //     rowMajor: function (rows, columns, source) {
    //         var array = source || [];
    //         _.extend(array, BasicUtils, TwoD, RowMajor);
    //         array.init(rows, columns);
    //         return array;
    //     },
    //     columnMajor: function (rows, columns, source) {
    //         var array = source || [];
    //         _.extend(array, BasicUtils, TwoD, ColumnMajor);
    //         array.init(rows, columns);
    //         return array;
    //     }
    // };
});
