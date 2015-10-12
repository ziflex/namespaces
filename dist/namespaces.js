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
    splitPath: function splitPath(path) {
        var separator = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

        var parts = path.split(separator);
        var len = parts.length;
        return {
            namespace: len > 1 ? parts.slice(0, len - 1).join(separator) : separator,
            name: parts[len - 1]
        };
    },
    buildPath: function buildPath() {
        var separator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];

        for (var _len = arguments.length, parts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            parts[_key - 1] = arguments[_key];
        }

        return parts.join(separator);
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

var _initializer = require('./initializer');

var _initializer2 = _interopRequireDefault(_initializer);

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

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

        this._separator = separator;
        this._storage = new _storage2['default'](separator);
        this._resolver = new _resolver2['default'](this._storage);
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

            var registered = false;
            return new _module3['default'](function (name, module) {
                if (registered) {
                    throw new Error('This module has been already registered');
                }

                var path = _helper2['default'].buildPath(_this._separator, namespace, name);
                var activator = new _initializer2['default'](path, module.create, module.dependencies);
                _this._storage.addItem(path, activator);
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
            return this._resolver.resolve(path);
        }
    }]);

    return Container;
})();

exports['default'] = Container;
module.exports = exports['default'];

},{"./helper":1,"./initializer":3,"./module":4,"./resolver":5,"./storage":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var Initializer = (function () {
    function Initializer(path, initialization, dependencies) {
        _classCallCheck(this, Initializer);

        this._path = path;
        this._initialization = initialization;
        this._dependencies = dependencies;
        this._isInitialized = false;
        this._value = null;
    }

    _createClass(Initializer, [{
        key: 'getPath',
        value: function getPath() {
            return this._path;
        }
    }, {
        key: 'getDependencies',
        value: function getDependencies() {
            return this._dependencies;
        }
    }, {
        key: 'getIsInitialized',
        value: function getIsInitialized() {
            return this._isInitialized;
        }
    }, {
        key: 'initialize',
        value: function initialize(dependencies) {
            if (this.getIsInitialized()) {
                throw new Error('Module ' + this._path + ' has been already initialized!');
            }

            this._value = this._initialization(dependencies);
            this._isInitialized = true;
        }
    }, {
        key: 'instance',
        value: function instance() {
            if (_helper2['default'].isFunction(this._value)) {
                return this._value();
            }

            return this._value;
        }
    }]);

    return Initializer;
})();

exports['default'] = Initializer;
module.exports = exports['default'];

},{"./helper":1}],4:[function(require,module,exports){
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

},{"./helper":1}],5:[function(require,module,exports){
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

    _createClass(Resolver, [{
        key: 'resolve',
        value: function resolve(path) {
            var _this = this;

            var resolveModule = function resolveModule(targetPath) {
                var module = _this._storage.getItem(targetPath);

                if (module.getIsInitialized()) {
                    return module.instance();
                }

                var deps = module.getDependencies();
                var resolvedDeps = [];
                if (_helper2['default'].isArray(deps)) {
                    resolvedDeps = deps.map(resolveModule);
                }

                module.initialize(resolvedDeps);
                return module.instance();
            };

            return resolveModule(path);
        }
    }]);

    return Resolver;
})();

exports['default'] = Resolver;
module.exports = exports['default'];

},{"./helper":1}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var Storage = (function () {
    function Storage() {
        var pathSeparator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];

        _classCallCheck(this, Storage);

        this._separator = pathSeparator;
        this._namespaces = {};
    }

    _createClass(Storage, [{
        key: 'addItem',
        value: function addItem(path, module) {
            var parts = _helper2['default'].splitPath(path, this._separator);
            parts.namespace = parts.namespace || this._separator;

            var registry = this._namespaces[parts.namespace];
            if (!registry) {
                registry = {};
                this._namespaces[parts.namespace] = registry;
            }

            if (registry[parts.name]) {
                throw new Error(parts.name + ' is already registered.');
            }

            registry[parts.name] = module;
        }
    }, {
        key: 'getItem',
        value: function getItem(path) {
            var parts = _helper2['default'].splitPath(path, this._separator);
            var namespace = this._namespaces[parts.namespace];

            if (!namespace) {
                throw new Error('Namespace \'' + parts.namespace + '\' was not found.');
            }

            var module = namespace[parts.name];

            if (!module) {
                throw new Error('Module with path \'' + path + '\' was not found.');
            }

            return module;
        }
    }]);

    return Storage;
})();

exports['default'] = Storage;
module.exports = exports['default'];

},{"./helper":1}]},{},[2])(2)
});