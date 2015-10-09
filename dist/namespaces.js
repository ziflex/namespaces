(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Namespaces = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var toString = Object.prototype.toString;
exports['default'] = {
    isUndefined: function isUndefined(value) {
        return typeof value === 'undefined';
    },
    isNull: function isNull(value) {
        return value === null;
    },
    isObject: function isObject(value) {
        return value !== null && typeof value === 'object';
    },
    isString: function isString(value) {
        return typeof value === 'string';
    },
    isFunction: function isFunction(value) {
        return typeof value === 'function';
    },
    isArray: function isArray(value) {
        return toString.call(value) === '[object Array]';
    },
    create: function create(constructor, args) {
        function Temp() {}
        Temp.prototype = constructor.prototype;
        var instance = new Temp();
        var result = constructor.apply(instance, args);
        return Object(result) === result ? result : instance;
    },
    normalizeArguments: function normalizeArguments() {
        var name = arguments[0];
        var dependencies = arguments[1];
        var definition = arguments[2];

        if (this.isUndefined(definition)) {
            definition = dependencies;
            dependencies = null;
        }

        return { name: name, dependencies: dependencies, definition: definition };
    },
    parsePath: function parsePath(path) {
        var separator = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

        var parts = path.split(separator);
        var len = parts.length;

        return {
            namespace: len > 1 ? parts.slice(0, len - 1).join(separator) : separator,
            name: parts[len - 1]
        };
    }
};
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

/**
 * Creates a new Container.
 * @class
 * @classdesc Represents a container for registered modules.
 */

var Container = (function () {
    /** @constructs
     * @param {string} separator - Namespace separator. Optional. Default '/'.
     */

    function Container() {
        var separator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];

        _classCallCheck(this, Container);

        this._namespaces = {};
        this._separator = separator;
    }

    /**
     * Register a module.
     * @param {string} namespace - Module namespace. Optional.
     * @returns {Module} new Module.
     */

    _createClass(Container, [{
        key: 'register',
        value: function register(namespace) {
            var _this = this;

            var targetNamespace = namespace || this._separator;
            var registered = false;
            return new _module3['default'](function (name, value) {
                if (registered) {
                    throw new Error('This module already registered');
                }

                var registry = _this._namespaces[targetNamespace];
                if (!registry) {
                    registry = {};
                    _this._namespaces[targetNamespace] = registry;
                }

                if (registry[name]) {
                    throw new Error(name + ' is already registered.');
                }

                registry[name] = new _resolver2['default'](_this, value);
                registered = true;
            });
        }

        /**
         * Resolve a module.
         * @param {string} path - Module namespace.
         * @returns {Module} new Module.
         */
    }, {
        key: 'resolve',
        value: function resolve(path) {
            var parts = _helper2['default'].parsePath(path, this._separator);
            var namespace = this._namespaces[parts.namespace];

            if (!namespace) {
                throw new Error('Namespace \'' + parts.namespace + '\' was not found.');
            }

            var module = namespace[parts.name];

            if (!module) {
                throw new Error('Module with path \'' + path + '\' was not found.');
            }

            return module.resolve();
        }
    }]);

    return Container;
})();

exports['default'] = Container;
module.exports = exports['default'];

},{"./helper":1,"./module":3,"./resolver":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

/**
 * Creates a new Module.
 * @class
 * @classdesc Represents a registered module.
 */

var Module = (function () {
    /** @constructor
     * @param {function} callback - Callback function for registering current module in container.
     */

    function Module(callback) {
        _classCallCheck(this, Module);

        this._callback = callback;
    }

    /**
     * Register a value, such as a string, a number, an array, an object or a constructor.
     * Note: If passed value is function type, it will be treated as constructor
     * and every time when it's injected, new instance will be created.
     * @param {string} name - Module name.
     * @param {array} dependencies - Module dependencies. Optional.
     * @param {string | number | object | array | function} definition - Module value.
     * @returns {function} Value factory.
     */

    _createClass(Module, [{
        key: 'value',
        value: function value(name, dependencies, definition) {
            var args = _helper2['default'].normalizeArguments(name, dependencies, definition);

            this._callback(args.name, {
                dependencies: args.dependencies,
                create: function create(resolved) {
                    // instances, simple types
                    if (!_helper2['default'].isFunction(args.definition)) {
                        return args.definition;
                    }

                    return function factory() {
                        return _helper2['default'].create(args.definition, resolved);
                    };
                }
            });
        }

        /**
         * Register a service constructor, which will be invoked with `new` to create the service instance.
         * Any type which was registered as a service is singleton.
         * @param {string} name - Module name.
         * @param {array} dependencies - Module dependencies. Optional.
         * @param {function} definition - Module constructor that will be instantiated.
         * @returns {function} Value factory.
         */
    }, {
        key: 'service',
        value: function service(name, dependencies, definition) {
            var args = _helper2['default'].normalizeArguments(name, dependencies, definition);

            if (!_helper2['default'].isFunction(args.definition)) {
                throw new Error('Service supports only constructors.');
            }

            this._callback(args.name, {
                dependencies: args.dependencies,
                create: function create(resolved) {
                    return _helper2['default'].create(args.definition, resolved);
                }
            });
        }

        /**
         * Register a service factory, which will be called to return the service instance.
         * Any function's value will be registered as a singleton.
         * @param {string} name - Module name.
         * @param {array} dependencies - Module dependencies. Optional.
         * @param {function} definition - Module factory.
         * @returns {function} Value factory.
         */
    }, {
        key: 'factory',
        value: function factory(name, dependencies, definition) {
            var args = _helper2['default'].normalizeArguments(name, dependencies, definition);

            if (!_helper2['default'].isFunction(args.definition)) {
                throw new Error('Factory supports only functions.');
            }

            this._callback(args.name, {
                dependencies: args.dependencies,
                create: function create(resolved) {
                    return args.definition.apply(args, _toConsumableArray(resolved));
                }
            });
        }
    }]);

    return Module;
})();

exports['default'] = Module;
module.exports = exports['default'];

},{"./helper":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

/**
 * Creates a new Resolver.
 * @class
 * @classdesc Represents a dependency resolver for particular module.
 */

var Resolver = (function () {
    /**
     * @constructor
     * @param container - Parent container.
     * @param module - Target module.
     */

    function Resolver(container, module) {
        _classCallCheck(this, Resolver);

        this._container = container;
        this._module = module;
        this._result = null;
    }

    /**
     * Resolves particular module.
     * @returns {any} Module's value.
     */

    _createClass(Resolver, [{
        key: 'resolve',
        value: function resolve() {
            if (this._result) {
                return this._result();
            }

            var dependencies = [];

            if (_helper2['default'].isArray(this._module.dependencies)) {
                dependencies = this._module.dependencies.map(this._container.resolve.bind(this._container));
            }

            this._result = (function getResult(val) {
                if (_helper2['default'].isFunction(val)) {
                    return val();
                }

                return val;
            }).bind(this, this._module.create(dependencies));

            return this._result();
        }
    }]);

    return Resolver;
})();

exports['default'] = Resolver;
module.exports = exports['default'];

},{"./helper":1}]},{},[2])(2)
});