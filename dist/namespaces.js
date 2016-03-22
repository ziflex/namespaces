(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Namespaces = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _mapPath = require('./map-path');

var _mapPath2 = _interopRequireDefault(_mapPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Creates a new Container.
 * @class
 * @classdesc Represents a container for registered modules.
 */

var Container = function (_Namespace) {
  _inherits(Container, _Namespace);

  /** @constructs
   * @param {string} separator - Namespace separator. Optional. Default '/'.
   */

  function Container() {
    var separator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];

    _classCallCheck(this, Container);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, separator, '', new _storage2.default(separator)));

    _this._resolver = new _resolver2.default(_this._storage);
    return _this;
  }

  /**
   * Determines whether a module with passed path exists.
   * @param {string} path - Module's path.
   * @return {boolean} Value that determines whether a module with passed path exists.
   */

  /**
   * Converts object/array to a function chain that's help to use namespaces.
   */


  _createClass(Container, [{
    key: 'contains',
    value: function contains(path) {
      return this._storage.contains(path);
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

    /**
     * Resolves all modules from particular namespace.
     * @param {string} namespace - Target namespace.
     * @returns {Map<string, any>} Map of module values, where key is module name.
     */

  }, {
    key: 'resolveAll',
    value: function resolveAll(namespace) {
      return this._resolver.resolveAll(namespace);
    }
  }]);

  return Container;
}(_namespace2.default);

Container.map = _mapPath2.default;
exports.default = Container;

},{"./map-path":3,"./namespace":5,"./resolver":6,"./storage":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _container2.default;

},{"./container":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createPathMap;

var _utils = require('./utils');

function create(separator, parentPath, current) {
    return function path(name) {
        if ((0, _utils.isArray)(name)) {
            return (0, _utils.map)(name, path);
        }

        return (0, _utils.joinPath)(separator, parentPath, current, name);
    };
}

function transform(separator, parent, current) {
    (0, _utils.forEach)(current, function (val, key) {
        if ((0, _utils.isString)(val)) {
            parent[key] = create(separator, parent(), val);
        } else if ((0, _utils.isArray)(val)) {
            parent[key] = create(separator, parent(), key);

            (0, _utils.forEach)(val, function (i) {
                var value = null;
                if ((0, _utils.isString)(i)) {
                    value = create(separator, parent[key](), i);
                } else if ((0, _utils.isObject)(i)) {
                    value = transform(separator, parent[key], i);
                }
                parent[key][i] = value;
            });
        } else if ((0, _utils.isObject)(val)) {
            parent[key] = create(separator, parent(), key);
            transform(separator, parent[key], val);
        }
    });

    return parent;
}

function createPathMap(target) {
    var separator = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

    return transform(separator, create(separator), target);
}

},{"./utils":8}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates a new Module.
 * @class
 * @classdesc Represents a module.
 */

var Module = function () {
    function Module(namespace, name, dependencies, initialize) {
        _classCallCheck(this, Module);

        this._namespace = namespace;
        this._name = name;
        this._initialize = initialize;
        this._dependencies = dependencies;
        this._isInitialized = false;
        this._value = null;
    }

    /**
     * Returns module namespace.
     * @returns {string} Module namespace.
     */


    _createClass(Module, [{
        key: 'getNamespace',
        value: function getNamespace() {
            return this._namespace;
        }

        /**
         * Returns module name.
         * @returns {string} Module name.
         */

    }, {
        key: 'getName',
        value: function getName() {
            return this._name;
        }

        /**
         * Returns a list of module dependencies.
         * @returns {(Array<string>|undefined)} List of module dependencies.
         */

    }, {
        key: 'getDependencies',
        value: function getDependencies() {
            return this._dependencies;
        }

        /**
         * Returns initialized module value.
         * @returns {any} Modules value.
         * @throws {Error} Throws error if modules is not initialized.
         */

    }, {
        key: 'getValue',
        value: function getValue() {
            if (!this.isInitialized()) {
                throw new Error('Module is not initialized!');
            }

            if ((0, _utils.isFunction)(this._value)) {
                return this._value();
            }

            return this._value;
        }

        /**
         * Returns value that determines whether module is initialized.
         * @returns {boolean} Value that determines whether module is initialized.
         */

    }, {
        key: 'isInitialized',
        value: function isInitialized() {
            return this._isInitialized;
        }

        /**
         * Initializes module.
         * @throws {Error} Throws error if modules is already initialized.
         */

    }, {
        key: 'initialize',
        value: function initialize(dependencies) {
            if (this.isInitialized()) {
                throw new Error('Module has been already initialized!');
            }

            this._value = this._initialize(dependencies);
            this._isInitialized = true;
        }
    }]);

    return Module;
}();

exports.default = Module;

},{"./utils":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
        var separator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
        var name = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
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


    _createClass(Namespace, [{
        key: 'getName',
        value: function getName() {
            return this._name;
        }

        /**
         * Returns a module namespace.
         * @param {string} name - Module namespace. Optional.
         * @returns {Namespace} Module namespace.
         */

    }, {
        key: 'namespace',
        value: function namespace(name) {
            return new Namespace(this._separator, (0, _utils.joinPath)(this._separator, this._name, name), this._storage);
        }

        /**
         * Register a value, such as a string, a number, an array, an object or a function.
         * @param {string} name - Module name.
         * @param {(string|number|object|array|function)} definition - Module value.
         * @returns {function} Value.
         */

    }, {
        key: 'const',
        value: function _const(name, definition) {
            var args = (0, _utils.parseArgs)(name, definition);

            this._storage.addItem(new _module2.default(this._name, args.name, args.dependencies, function initialize() {
                return function factory() {
                    return args.definition;
                };
            }));
        }

        /**
         * Register a value, such as a string, a number, an array, an object or a constructor.
         * Note: If passed value is function type, it will be treated as constructor
         * and every time when it's injected, new instance will be created.
         * @param {string} name - Module name.
         * @param {array} dependencies - Module dependencies. Optional.
         * @param {(string|number|object|array|function)} definition - Module value.
         * @returns {function} Value factory.
         */

    }, {
        key: 'value',
        value: function value(name, dependencies, definition) {
            var args = (0, _utils.parseArgs)(name, dependencies, definition);

            this._storage.addItem(new _module2.default(this._name, args.name, args.dependencies, function initialize(resolved) {
                // instances, simple types
                if (!(0, _utils.isFunction)(args.definition)) {
                    return args.definition;
                }

                return function factory() {
                    return (0, _utils.create)(args.definition, resolved);
                };
            }));
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
            var args = (0, _utils.parseArgs)(name, dependencies, definition);

            if (!(0, _utils.isFunction)(args.definition)) {
                throw new Error('Service supports only constructors.');
            }

            this._storage.addItem(new _module2.default(this._name, args.name, args.dependencies, function initialize(resolved) {
                return (0, _utils.create)(args.definition, resolved);
            }));
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
            var args = (0, _utils.parseArgs)(name, dependencies, definition);

            if (!(0, _utils.isFunction)(args.definition)) {
                throw new Error('Factory supports only functions.');
            }

            this._storage.addItem(new _module2.default(this._name, args.name, args.dependencies, function initialize(resolved) {
                return args.definition.apply(args, _toConsumableArray(resolved));
            }));
        }
    }]);

    return Namespace;
}();

exports.default = Namespace;

},{"./module":4,"./utils":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

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


    _createClass(Resolver, [{
        key: 'resolve',
        value: function resolve(path) {
            var _this = this;

            var resolveModule = function resolveModule(targetPath) {
                var module = _this._storage.getItem(targetPath);

                if (module.isInitialized()) {
                    return module.getValue();
                }

                var resolveDependencies = function resolveDependencies(dependencies) {
                    if ((0, _utils.isArray)(dependencies)) {
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
        }

        /**
         * Resolves all modules from particular namespace.
         * @param {string} namespace - Target namespace.
         * @returns {Map<string, any>} Map of module values, where key is module name.
         */

    }, {
        key: 'resolveAll',
        value: function resolveAll(namespace) {
            var _this2 = this;

            var result = {};

            this._storage.forEachIn(namespace, function (module, path) {
                result[module.getName()] = _this2.resolve(path);
            });

            return result;
        }
    }]);

    return Resolver;
}();

exports.default = Resolver;

},{"./utils":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _module = require('./module');

var _module2 = _interopRequireDefault(_module);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MISSED_MODULE = 'Missed module!';
var MISSED_MODULE_NAME = 'Missed module name!';
var MISSED_NAMESPACE = 'Missed module namespace!';
var MISSED_CALLBACK = 'Missed callback';
var INVALID_MODULE = 'Invalid module!';
var INVALID_NAMESPACE = 'Invalid namespace!';
var INVALID_MODULE_NAME = 'Invalid module name!';
var INVALID_MODULE_PATH = 'Invalid module path!';
var NAMESPACE_NOT_FOUND = 'Namespace was not found';
var MODULE_NOT_FOUND = 'Module with path was not found';

/**
 * Creates a new Storage.
 * @class
 * @classdesc Represents a modules storage.
 */

var Storage = function () {
    function Storage() {
        var pathSeparator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];

        _classCallCheck(this, Storage);

        this._separator = pathSeparator;
        this._namespaces = {};
    }

    /**
     * Adds module to storage.
     * @param {Module} module - Target module to add.
     * @throws {Error} Throws an error if module with same path already exists.
     */


    _createClass(Storage, [{
        key: 'addItem',
        value: function addItem(module) {
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

            if (registry[name]) {
                throw new Error(name + ' is already registered.');
            }

            registry[name] = module;
        }

        /**
         * Tries to find a module with passed path.
         * @param {string} path - Module's path.
         * @return {Module} found module.
         * @throws {Error} Throws error in module wasn't found.
         */

    }, {
        key: 'getItem',
        value: function getItem(path) {
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
        }

        /**
         * Determines whether a module with passed path exists.
         * @param {string} path - Module's path.
         * @return {boolean} Value that determines whether a module with passed path exists.
         */

    }, {
        key: 'contains',
        value: function contains(path) {
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
        }
    }, {
        key: 'forEachIn',
        value: function forEachIn(namespace, callback) {
            if ((0, _utils.isNullOrUndefined)(namespace)) {
                throw new Error(MISSED_NAMESPACE);
            }

            if (!(0, _utils.isFunction)(callback)) {
                throw new Error(MISSED_CALLBACK);
            }

            var registry = this._namespaces[namespace];

            if (!registry) {
                throw new Error(NAMESPACE_NOT_FOUND + ': ' + namespace + '!');
            }

            for (var name in registry) {
                if (registry.hasOwnProperty(name) && registry[name]) {
                    callback(registry[name], (0, _utils.joinPath)(this._separator, namespace, name));
                }
            }
        }
    }]);

    return Storage;
}();

exports.default = Storage;

},{"./module":4,"./utils":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.isUndefined = isUndefined;
exports.isNull = isNull;
exports.isNullOrUndefined = isNullOrUndefined;
exports.isObject = isObject;
exports.isString = isString;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.create = create;
exports.parseArgs = parseArgs;
exports.isValidName = isValidName;
exports.joinPath = joinPath;
exports.splitPath = splitPath;
exports.forEach = forEach;
exports.map = map;
exports.reduce = reduce;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
    var separator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
    var name = arguments[1];

    return name.indexOf(separator) === -1;
}

function joinPath() {
    var separator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];

    var paths = [];
    var len = arguments.length - 1;

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
    var separator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
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
    var context = arguments.length <= 2 || arguments[2] === undefined ? this : arguments[2];

    if (isArray(collection)) {
        for (var i = 0; i < collection.length; i += 1) {
            iteratee.call(context, collection[i], i);
        }
    } else if (isObject(collection)) {
        for (var prop in collection) {
            if (collection.hasOwnProperty(prop)) {
                iteratee.call(context, collection[prop], prop);
            }
        }
    }
}

function map(collection, iteratee) {
    var context = arguments.length <= 2 || arguments[2] === undefined ? this : arguments[2];

    var result = [];

    forEach(collection, function (v, k) {
        result.push(iteratee.call(context, v, k));
    });

    return result;
}

function reduce(collection, iteratee, initialValue) {
    var _this = this;

    var context = arguments.length <= 3 || arguments[3] === undefined ? this : arguments[3];

    var result = initialValue;

    forEach(collection, function (v, k) {
        result = iteratee.call(_this, result || v, v, k);
    }, context);

    return result;
}

},{}]},{},[2])(2)
});