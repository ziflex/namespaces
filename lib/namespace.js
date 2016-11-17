'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

var _module = require('./module');

var _module2 = _interopRequireDefault(_module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates a new Namespace.
 * @class
 * @classdesc Represents a module namespace.
 */
var Namespace = function () {

    /** @constructor
     * @param {string} separator - Namespace separator.
     * @param {string} name - Namespace name.
     * @param {Storage} storage - Global modules storage.
     */
    function Namespace() {
        var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var storage = arguments[2];

        _classCallCheck(this, Namespace);

        this._separator = separator;
        this._name = name;
        this._storage = storage;
    }

    /**
     * Returns a namespace name.
     * @returns {string} Namespace name.
     */


    Namespace.prototype.getName = function getName() {
        return this._name;
    };

    /**
     * Returns a module namespace.
     * @param {string} name - Module namespace. Optional.
     * @returns {Namespace} Module namespace.
     */


    Namespace.prototype.namespace = function namespace(name) {
        return new Namespace(this._separator, (0, _utils.joinPath)(this._separator, this._name, name), this._storage);
    };

    /**
     * Register a value, such as a string, a number, an array, an object or a function.
     * @param {string} name - Module name.
     * @param {(string|number|object|array|function)} definition - Module value.
     * @returns {function} Value.
     */


    Namespace.prototype.const = function _const(name, definition) {
        var args = (0, _utils.parseArgs)(name, definition);

        this._storage.addItem(new _module2.default(this._name, args.name, args.dependencies, function () {
            return function factory() {
                return args.definition;
            };
        }));
    };

    /**
     * Register a value, such as a string, a number, an array, an object or a constructor.
     * Note: If passed value is function type, it will be treated as constructor
     * and every time when it's injected, new instance will be created.
     * @param {string} name - Module name.
     * @param {array} dependencies - Module dependencies. Optional.
     * @param {(string|number|object|array|function)} definition - Module value.
     * @returns {function} Value factory.
     */


    Namespace.prototype.value = function value(name, dependencies, definition) {
        var args = (0, _utils.parseArgs)(name, dependencies, definition);

        this._storage.addItem(new _module2.default(this._name, args.name, args.dependencies, function (resolved) {
            // instances, simple types
            if (!(0, _utils.isFunction)(args.definition)) {
                return function factory() {
                    return args.definition;
                };
            }

            return function factory() {
                return (0, _utils.create)(args.definition, resolved);
            };
        }));
    };

    /**
     * Register a service constructor,
     * which will be invoked with `new` to create the service instance.
     * Any type which was registered as a service is singleton.
     * @param {string} name - Module name.
     * @param {array} dependencies - Module dependencies. Optional.
     * @param {function} definition - Module constructor that will be instantiated.
     * @returns {function} Value factory.
     */


    Namespace.prototype.service = function service(name, dependencies, definition) {
        var args = (0, _utils.parseArgs)(name, dependencies, definition);

        if (!(0, _utils.isFunction)(args.definition)) {
            var path = (0, _utils.joinPath)(this._separator, this._name, name);
            throw new Error('Service supports only constructors: ' + path);
        }

        this._storage.addItem(new _module2.default(this._name, args.name, args.dependencies, function (resolved) {
            var value = (0, _utils.create)(args.definition, resolved);

            return function factory() {
                return value;
            };
        }));
    };

    /**
     * Register a service factory, which will be called to return the service instance.
     * Any function's value will be registered as a singleton.
     * @param {string} name - Module name.
     * @param {array} dependencies - Module dependencies. Optional.
     * @param {function} definition - Module factory.
     * @returns {function} Value factory.
     */


    Namespace.prototype.factory = function factory(name, dependencies, definition) {
        var args = (0, _utils.parseArgs)(name, dependencies, definition);

        if (!(0, _utils.isFunction)(args.definition)) {
            var path = (0, _utils.joinPath)(this._separator, this._name, name);
            throw new Error('Factory supports only functions: ' + path);
        }

        this._storage.addItem(new _module2.default(this._name, args.name, args.dependencies, function (resolved) {
            var value = args.definition.apply(args, _toConsumableArray(resolved));

            return function factory() {
                return value;
            };
        }));
    };

    return Namespace;
}();

exports.default = Namespace;