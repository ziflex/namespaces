'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toposort = require('toposort');

var _toposort2 = _interopRequireDefault(_toposort);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_DEPENDENCIES = [];

/**
 * Creates a new Resolver.
 * @class
 * @classdesc Represents a dependency resolver for particular module.
 */

var Resolver = function () {
    /**
     * @constructor
     * @param storage - Module's storage.
     */
    function Resolver(storage) {
        _classCallCheck(this, Resolver);

        this._storage = storage;
    }

    /**
     * Resolves particular module.
     * @returns {any} Module's value.
     */


    Resolver.prototype.resolve = function resolve(path) {
        var _this = this;

        var graph = [];
        var chain = [];
        var checkCircularDependency = function checkCircularDependency(targetPath, dependencies) {
            (0, _utils.forEach)(dependencies, function (i) {
                return graph.push([targetPath, i]);
            });
            chain.push.apply(chain, _toConsumableArray(dependencies));
            try {
                (0, _toposort2.default)(graph);
            } catch (e) {
                throw new ReferenceError('Circular dependency: ' + path + ' -> ' + chain.join(' -> '));
            }
        };
        var resolveModule = function resolveModule(targetPath) {
            var module = _this._storage.getItem(targetPath);

            if (module.isInitialized()) {
                return module.getValue();
            }

            var resolveDependencies = function resolveDependencies(dependencies) {
                if ((0, _utils.isArray)(dependencies)) {
                    checkCircularDependency(targetPath, dependencies);
                    return (0, _utils.map)(dependencies, function (currentPath) {
                        if ((0, _utils.isString)(currentPath)) {
                            return resolveModule(currentPath);
                        } else if ((0, _utils.isFunction)(currentPath)) {
                            return currentPath();
                        }

                        return undefined;
                    });
                }

                if ((0, _utils.isFunction)(dependencies)) {
                    var result = dependencies();

                    if (!(0, _utils.isArray)(result)) {
                        return [result];
                    }

                    return result;
                }

                return DEFAULT_DEPENDENCIES;
            };

            module.initialize(resolveDependencies(module.getDependencies()));
            return module.getValue();
        };

        return resolveModule(path);
    };

    /**
     * Resolves all modules from particular namespace.
     * @param {string} namespace - Target namespace.
     * @returns {Map<string, any>} Map of module values, where key is module name.
     */


    Resolver.prototype.resolveAll = function resolveAll(namespace) {
        var _this2 = this;

        var result = {};

        this._storage.forEachIn(namespace, function (module, path) {
            result[module.getName()] = _this2.resolve(path);
        });

        return result;
    };

    return Resolver;
}();

exports.default = Resolver;