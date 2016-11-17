'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isUndefined = isUndefined;
exports.isNull = isNull;
exports.isNullOrUndefined = isNullOrUndefined;
exports.isObject = isObject;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.create = create;
exports.parseArgs = parseArgs;
exports.isValidName = isValidName;
exports.joinPath = joinPath;
exports.splitPath = splitPath;
exports.forEach = forEach;
exports.find = find;
exports.filter = filter;
exports.map = map;
exports.reduce = reduce;
exports.setIn = setIn;
exports.getIn = getIn;
exports.hasIn = hasIn;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-disable no-restricted-syntax, no-param-reassign */
var toString = Object.prototype.toString;

function isUndefined(value) {
    return typeof value === 'undefined';
}

function isNull(value) {
    return value === null;
}

function isNullOrUndefined(arg) {
    return isNull(arg) || isUndefined(arg);
}

function isObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

function isString(value) {
    return typeof value === 'string';
}

function isNumber(value) {
    return value !== null && !isNaN(value) && typeof value === 'number';
}

function isFunction(value) {
    return typeof value === 'function';
}

function isArray(value) {
    return toString.call(value) === '[object Array]';
}

function create(constructor, args) {
    function Temp() {}
    Temp.prototype = constructor.prototype;
    var instance = new Temp();
    var result = constructor.apply(instance, args);
    return Object(result) === result ? result : instance;
}

function parseArgs() {
    var name = arguments.length <= 0 ? undefined : arguments[0];
    var dependencies = arguments.length <= 1 ? undefined : arguments[1];
    var definition = arguments.length <= 2 ? undefined : arguments[2];

    if (isUndefined(definition)) {
        definition = dependencies;
        dependencies = null;
    }

    return { name: name, dependencies: dependencies, definition: definition };
}

function isValidName() {
    var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
    var name = arguments[1];

    return name.indexOf(separator) === -1;
}

function joinPath() {
    var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

    var paths = [];
    var len = arguments.length <= 1 ? 0 : arguments.length - 1;

    for (var i = 0; i <= len; i += 1) {
        var part = arguments.length <= i + 1 ? undefined : arguments[i + 1];

        if (isString(part)) {
            part = part.trim();

            if (part && part !== separator) {
                paths.push(part);
            }
        }
    }

    return '' + paths.join(separator);
}

function splitPath() {
    var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
    var path = arguments[1];

    var result = { namespace: '', name: '' };

    if (!isString(path)) {
        return result;
    }

    var normalizedPath = path.trim();

    if (normalizedPath === separator) {
        result.namespace = '';
        return result;
    }

    var parts = normalizedPath.split(separator);
    var len = parts.length;

    if (len > 1) {
        result.namespace = joinPath.apply(undefined, [separator].concat(_toConsumableArray(parts.slice(0, len - 1))));
    } else {
        result.namespace = '';
    }

    result.name = parts[len - 1] || '';

    if (isString(result.name) && !result.name.trim()) {
        result.name = '';
    }

    return result;
}

function forEach(collection, iteratee) {
    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

    if (isArray(collection)) {
        for (var i = 0; i < collection.length; i += 1) {
            if (iteratee.call(context, collection[i], i) === false) {
                break;
            }
        }
    } else if (isObject(collection)) {
        for (var prop in collection) {
            if (collection.hasOwnProperty(prop)) {
                if (iteratee.call(context, collection[prop], prop) === false) {
                    break;
                }
            }
        }
    }
}

function find(collection, iteratee) {
    var result = null;

    if (!isFunction(iteratee)) {
        return result;
    }

    forEach(collection, function (v, k) {
        if (iteratee(v, k) === true) {
            result = v;
            return false;
        }

        return true;
    });

    return result;
}

function filter(collection, iteratee) {
    var result = [];

    if (!isFunction(iteratee)) {
        return result;
    }

    forEach(collection, function (v, k) {
        if (iteratee(v, k) === true) {
            result.push(v);
        }
    });

    return result;
}

function map(collection, iteratee) {
    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

    var result = [];

    forEach(collection, function (v, k) {
        result.push(iteratee.call(context, v, k));
    });

    return result;
}

function reduce(collection, iteratee, initialValue) {
    var _this = this;

    var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this;

    var result = initialValue;

    forEach(collection, function (v, k) {
        result = iteratee.call(_this, result || v, v, k);
    }, context);

    return result;
}

function setIn(target, path, value) {
    if (!isArray(path)) {
        return target;
    }

    var result = target || {};
    var endIndex = path.length - 1;
    reduce(path, function (obj, pathPart, index) {
        var prop = obj;

        if (index === endIndex) {
            prop[pathPart] = value;
        } else {
            prop = obj[pathPart];

            if (!prop) {
                prop = {};
                obj[pathPart] = prop;
            }
        }

        return prop;
    }, result);

    return result;
}

function getIn(target, path) {
    var result = null;

    if (!isArray(path)) {
        return result;
    }

    var endIndex = path.length - 1;
    var prop = target;

    forEach(path, function (pathPart, index) {
        if (endIndex === index) {
            result = prop[pathPart];
            return false;
        }

        prop = prop[pathPart];

        if (!prop) {
            return false;
        }

        return true;
    });

    return result;
}

function hasIn(target, path) {
    return getIn(target, path) !== null;
}