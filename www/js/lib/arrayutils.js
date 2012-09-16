/**
 * `ArrayUtils`
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

    //--------------------------------------------------------------------------
    //
    // OneD
    //
    //--------------------------------------------------------------------------
    /**
     * OneD
     *
     * Creates an instance of a 1 dimensional array wrapper.
     */
    var OneD = ArrayUtils.OneD = function (source) {
        this.setSource(source || []);
    };

    _.extend(OneD.prototype, {
        source: null,
        setSource: function (array) {
            this.source = array;
            _.each(Object.getOwnPropertyNames(Array.prototype), function (name) {
                var method = Array.prototype[name];
                if (typeof method === 'function') {
                    this[name] = function () {
                        return method.apply(this.source, arguments);
                    };
                }
            }, this);
        },
        length: function () {
            return this.source.length;
        },
        /**
         * `at`
         *
         * Returns the element at the given index.
         */
        at: function (index) {
            return this.source[index];
        },
        /**
         * `toArray`
         *
         * Returns an Array representation of this object.
         */
        toArray: function () {
            return this.source.slice(0);
        },
        /**
         * `addAt`
         *
         * Adds or replaces an object at the given index of the `source` Array.
         * Every possible value is allowed, including undefined, NaN, and null.
         * Returns the newly added object.
         */
        addAt: function (index, object) {
            return (this.source[index] = object);
        },
        /**
         * deleteAt
         *
         * Deletes an element at an index from the `source` array and returns
         * the deleted element. The element at the deleted index will take a value
         * of 'undefined'.
         */
        deleteAt: function (index) {
            var el = this.source[index];
            delete this.source[index];
            return el;
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
    // TwoD
    //
    //--------------------------------------------------------------------------
    /**
     * `TwoD`
     *
     * Base prototype for `RowMajor` and `ColumnMajor` 2 dimensional array wrappers.
     */
    var TwoD = function (rows, columns, source) {
        if (_.isUndefined(rows) || _.isNull(rows)) {
            throw new ReferenceError('The `rows` parameter is required.');
        }
        if (_.isUndefined(columns) || _.isNull(columns)) {
            throw new ReferenceError('The `columns` parameter is required.');
        }
        if (!_.isNumber(rows)) {
            throw new TypeError('`rows` must be a Number.');
        }
        if (!_.isNumber(columns)) {
            throw new TypeError('`columns` must be a Number.');
        }
        if (rows <= 0) {
            throw new Error('`rows` must be greater than 0.');
        }
        if (columns <= 0) {
            throw new Error('`columns` must be greater than 0.');
        }
        OneD.prototype.constructor.call(this, source);
        this.rows = rows;
        this.columns = columns;
    };

    _.extend(TwoD.prototype, OneD.prototype, {
        rows: 0,
        columns: 0,
        /**
         * `getOffset`
         *
         * Noop method to be implemented by extending prototypes.
         */
        getOffset: function (row, column) {
            return 0;
        },
        /**
         * `at`
         *
         * Returns the element at a given row / column.
         */
        at: function (row, column) {
            return this.source[this.getOffset(row, column)];
        },
        /**
         * `addAt`
         *
         * Inserts / replaces an element at the given row / column.
         */
        addAt: function (row, column, object) {
            return (this.source[this.getOffset(row, column)] = object);
        },
        /**
         * `deleteAt`
         *
         * Deletes an element at the given row / column, and returs the deleted
         * element.
         */
        deleteAt: function (row, column) {
            var el = this.at(row, column);
            delete this.source[this.getOffset(row, column)];
            return el;
        }
    });

    //--------------------------------------------------------------------------
    //
    // RowMajor
    //
    //--------------------------------------------------------------------------

    var RowMajor = ArrayUtils.RowMajor = function (rows, columns, source) {
        TwoD.prototype.constructor.apply(this, arguments);
    };

    _.extend(RowMajor.prototype, TwoD.prototype, {
        /**
         * `getRow`
         *
         * Returns a new OneD array wrapper instance with the requested row.
         */
        getRow: function (row) {
            return new OneD(getConsecutive(this.source, row, this.columns));
        },
        /**
         * `getColumn`
         *
         * Returns a new OneD array wrapper instance with the requested column.
         */
        getColumn: function (column) {
            return new OneD(getNonConsecutive(this.source, column, this.rows, this.columns));
        },
        /**
         * `getOffset`
         *
         * Given a row and column, returns the index of such element in the
         * linear source array
         */
        getOffset: function (row, column) {
            return row * this.columns + column;
        }
    });

    //--------------------------------------------------------------------------
    //
    // ColumnMajor
    //
    //--------------------------------------------------------------------------

    var ColumnMajor = ArrayUtils.ColumnMajor = function (rows, columns, source) {
        TwoD.prototype.constructor.apply(this, arguments);
    };

    _.extend(ColumnMajor.prototype, TwoD.prototype, {
        /**
         * `getRow`
         *
         * Returns a new OneD array wrapper instance with the requested row.
         */
        getRow: function (row) {
            return new OneD(getNonConsecutive(this.source, row, this.columns, this.rows));
        },
        /**
         * `getColumn`
         *
         * Returns a new OneD array wrapper instance with the requested column.
         */
        getColumn: function (column) {
            return new OneD(getConsecutive(this.source, column, this.rows));
        },
        /**
         * `getOffset`
         *
         * Given a row and column, returns the index of such element in the
         * linear source array
         */
        getOffset: function (row, column) {
            return column * this.rows + row;
        }
    });

    //--------------------------------------------------------------------------
    //
    // Exports
    //
    //--------------------------------------------------------------------------

    return ArrayUtils;

});
