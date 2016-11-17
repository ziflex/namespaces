'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _module = require('./module');

var _module2 = _interopRequireDefault(_module);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MISSED_MODULE = 'Missed module';
var MISSED_MODULE_NAME = 'Missed module name';
var MISSED_NAMESPACE = 'Missed module namespace';
var MISSED_CALLBACK = 'Missed callback';
var INVALID_MODULE = 'Invalid module';
var INVALID_NAMESPACE = 'Invalid namespace';
var INVALID_MODULE_NAME = 'Invalid module name';
var INVALID_MODULE_PATH = 'Invalid module path';
var NAMESPACE_NOT_FOUND = 'Namespace was not found';
var MODULE_NOT_FOUND = 'Module with path was not found';

/**
 * Creates a new Storage.
 * @class
 * @classdesc Represents a modules storage.
 */

var Storage = function () {
    function Storage() {
        var pathSeparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

        _classCallCheck(this, Storage);

        this._separator = pathSeparator;
        this._namespaces = {};
    }

    /**
     * Adds module to storage.
     * @param {Module} module - Target module to add.
     * @throws {Error} Throws an error if module with same path already exists.
     */


    Storage.prototype.addItem = function addItem(module) {
        if (!module) {
            throw new Error(MISSED_MODULE);
        }

        if (!(module instanceof _module2.default)) {
            throw new Error(INVALID_MODULE);
        }

        var namespace = module.getNamespace();

        if (!(0, _utils.isString)(namespace)) {
            throw new Error(INVALID_NAMESPACE);
        }

        var name = module.getName();

        if (!name) {
            throw new Error(MISSED_MODULE_NAME);
        }

        if (!(0, _utils.isString)(name)) {
            throw new Error(INVALID_MODULE_NAME);
        }

        if (!(0, _utils.isValidName)(this._separator, name)) {
            throw new Error(INVALID_MODULE_PATH + ' Module is now alllowed to contain namespace separators.');
        }

        var registry = this._namespaces[namespace];

        if (!registry) {
            registry = {};
            this._namespaces[namespace] = registry;
        }

        if (registry.hasOwnProperty(name)) {
            throw new Error(name + ' is already registered.');
        }

        registry[name] = module;
    };

    /**
     * Tries to find a module with passed path.
     * @param {string} path - Module's path.
     * @return {Module} found module.
     * @throws {Error} Throws error in module wasn't found.
     */


    Storage.prototype.getItem = function getItem(path) {
        if (!(0, _utils.isString)(path)) {
            throw new Error(INVALID_MODULE_PATH);
        }

        var parts = (0, _utils.splitPath)(this._separator, path);
        var namespace = this._namespaces[parts.namespace];

        if (!namespace) {
            throw new Error(MODULE_NOT_FOUND + ': ' + path + '!');
        }

        var module = namespace[parts.name];

        if (!module) {
            throw new Error(MODULE_NOT_FOUND + ': ' + path + '!');
        }

        return module;
    };

    /**
     * Determines whether a module with passed path exists.
     * @param {string} path - Module's path.
     * @return {boolean} Value that determines whether a module with passed path exists.
     */


    Storage.prototype.contains = function contains(path) {
        if (!(0, _utils.isString)(path)) {
            throw new Error(INVALID_MODULE_PATH);
        }

        var parts = (0, _utils.splitPath)(this._separator, path);
        var namespace = this._namespaces[parts.namespace];

        if (!namespace) {
            return false;
        }

        var module = namespace[parts.name];

        if (!module) {
            return false;
        }

        return true;
    };

    Storage.prototype.forEachIn = function forEachIn(namespace, callback) {
        var _this = this;

        if ((0, _utils.isNullOrUndefined)(namespace)) {
            throw new Error(MISSED_NAMESPACE);
        }

        if (!(0, _utils.isString)(namespace)) {
            throw new Error(INVALID_NAMESPACE);
        }

        if (!(0, _utils.isFunction)(callback)) {
            throw new Error(MISSED_CALLBACK);
        }

        var registry = this._namespaces[namespace];

        if (!registry) {
            throw new Error(NAMESPACE_NOT_FOUND + ': ' + namespace + '!');
        }

        (0, _utils.forEach)(registry, function (value, name) {
            callback(value, (0, _utils.joinPath)(_this._separator, namespace, name));
        });
    };

    return Storage;
}();

exports.default = Storage;