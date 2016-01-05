(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Namespaces = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

/**
 * Creates a new Container.
 * @class
 * @classdesc Represents a container for registered modules.
 */

var Container = (function (_Namespace) {
  _inherits(Container, _Namespace);

  /** @constructs
   * @param {string} separator - Namespace separator. Optional. Default '/'.
   */

  function Container() {
    var separator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];

    _classCallCheck(this, Container);

    _get(Object.getPrototypeOf(Container.prototype), 'constructor', this).call(this, separator, '', new _storage2['default'](separator));
    this._resolver = new _resolver2['default'](this._storage);
  }

  /**
   * Returns a module namespace.
   * @param {string} namespace - Module namespace. Optional.
   * @returns {Namespace} Module namespace.
   */

  _createClass(Container, [{
    key: 'register',
    value: function register(namespace) {
      console.warn('Method "register" is deprecated. Use container itself or "namespace" method instead.');
      return new _namespace2['default'](this._separator, namespace || this._name, this._storage);
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
})(_namespace2['default']);

exports['default'] = Container;
module.exports = exports['default'];

},{"./namespace":4,"./resolver":5,"./storage":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

exports['default'] = _container2['default'];
module.exports = exports['default'];

},{"./container":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

/**
 * Creates a new Module.
 * @class
 * @classdesc Represents a module.
 */

var Module = (function () {
    function Module(namespace, name, dependencies, initialize) {
        _classCallCheck(this, Module);

        this._namespace = namespace;
        this._name = name;
        this._initialize = initialize;
        this._dependencies = dependencies;
        this._isInitialized = false;
        this._value = null;
    }

    _createClass(Module, [{
        key: 'getNamespace',
        value: function getNamespace() {
            return this._namespace;
        }
    }, {
        key: 'getName',
        value: function getName() {
            return this._name;
        }
    }, {
        key: 'getDependencies',
        value: function getDependencies() {
            return this._dependencies;
        }
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
    }, {
        key: 'isInitialized',
        value: function isInitialized() {
            return this._isInitialized;
        }
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
})();

exports['default'] = Module;
module.exports = exports['default'];

},{"./utils":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

/**
 * Creates a new Namespace.
 * @class
 * @classdesc Represents a module namespace.
 */

var Namespace = (function () {
    /** @constructor
     * @param {string} separator - Namespace separator.
     * @param {string} name - Namespace name.
     * @param {Storage} storage - Global modules storage.
     */

    function Namespace(separator, name, storage) {
        if (separator === undefined) separator = '/';
        if (name === undefined) name = '';

        _classCallCheck(this, Namespace);

        this._separator = separator;
        this._name = name;
        this._storage = storage;
    }

    /**
     * Returns a module namespace.
     * @param {string} name - Module namespace. Optional.
     * @returns {Namespace} Module namespace.
     */

    _createClass(Namespace, [{
        key: 'namespace',
        value: function namespace(name) {
            return new Namespace(this._separator, (0, _utils.joinPath)(this._separator, this._name, name), this._storage);
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
    }, {
        key: 'value',
        value: function value(name, dependencies, definition) {
            var args = (0, _utils.parseArgs)(name, dependencies, definition);

            this._storage.addItem(new _module3['default'](this._name, args.name, args.dependencies, function initialize(resolved) {
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

            this._storage.addItem(new _module3['default'](this._name, args.name, args.dependencies, function initialize(resolved) {
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

            this._storage.addItem(new _module3['default'](this._name, args.name, args.dependencies, function initialize(resolved) {
                return args.definition.apply(args, _toConsumableArray(resolved));
            }));
        }
    }]);

    return Namespace;
})();

exports['default'] = Namespace;
module.exports = exports['default'];

},{"./module":3,"./utils":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

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

                if (module.isInitialized()) {
                    return module.getValue();
                }

                var deps = module.getDependencies();
                var resolvedDeps = [];
                if ((0, _utils.isArray)(deps)) {
                    resolvedDeps = deps.map(resolveModule);
                }

                module.initialize(resolvedDeps);
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
})();

exports['default'] = Resolver;
module.exports = exports['default'];

},{"./utils":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _utils = require('./utils');

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

var Storage = (function () {
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

            if (!(module instanceof _module3['default'])) {
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
                throw new Error(NAMESPACE_NOT_FOUND + ': ' + parts.namespace + '!');
            }

            var module = namespace[parts.name];

            if (!module) {
                throw new Error(MODULE_NOT_FOUND + ': ' + parts.name + '!');
            }

            return module;
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

            for (var _name in registry) {
                if (registry.hasOwnProperty(_name) && registry[_name]) {
                    callback(registry[_name], (0, _utils.joinPath)(this._separator, namespace, _name));
                }
            }
        }
    }]);

    return Storage;
})();

exports['default'] = Storage;
module.exports = exports['default'];

},{"./module":3,"./utils":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

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
    return value !== null && typeof value === 'object';
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
    var name = arguments[0];
    var dependencies = arguments[1];
    var definition = arguments[2];

    if (isUndefined(definition)) {
        definition = dependencies;
        dependencies = null;
    }

    return { name: name, dependencies: dependencies, definition: definition };
}

function isValidName(separator, name) {
    if (separator === undefined) separator = '/';

    return name.indexOf(separator) === -1;
}

function joinPath() {
    var separator = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];

    var paths = [];

    for (var _len = arguments.length, parts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        parts[_key - 1] = arguments[_key];
    }

    var len = parts.length;

    for (var i = 0; i <= len; i += 1) {
        var part = parts[i];

        if (isString(part)) {
            part = part.trim();

            if (part && part !== separator) {
                paths.push(part);
            }
        }
    }

    return '' + paths.join(separator);
}

function splitPath(separator, path) {
    if (separator === undefined) separator = '/';

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

},{}]},{},[2])(2)
});