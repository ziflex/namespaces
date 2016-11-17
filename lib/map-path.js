'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createPathMap;

var _utils = require('./utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function create(separator, current) {
    var currentPath = (0, _utils.isArray)(current) ? _utils.joinPath.apply(undefined, [separator].concat(_toConsumableArray(current))) : current;
    return function path(name) {
        if ((0, _utils.isArray)(name)) {
            return (0, _utils.map)(name, path);
        }

        return (0, _utils.joinPath)(separator, currentPath, name);
    };
}

function traverse(node) {
    var parentPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var callback = arguments[2];

    (0, _utils.forEach)(node, function (value, keyOrIndex) {
        if ((0, _utils.isString)(value) || (0, _utils.isNumber)(value)) {
            callback(node, [].concat(_toConsumableArray(parentPath), [value]), parentPath);
            return;
        }

        var newPath = parentPath;

        if ((0, _utils.isArray)(node)) {
            if ((0, _utils.isObject)(value)) {
                traverse(value, newPath, callback);
            } else {
                traverse(value, newPath.slice().pop(), callback);
            }
        } else {
            newPath = [].concat(_toConsumableArray(parentPath), [keyOrIndex]);
            callback(node, newPath, parentPath);
            traverse(value, newPath, callback);
        }
    });
}

function createPathMap(target) {
    var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';

    var result = create(separator);

    traverse(target, [], function (value, path) {
        (0, _utils.setIn)(result, path, create(separator, path));
    });

    return result;
}