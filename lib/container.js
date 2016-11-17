'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _mapPath = require('./map-path');

var _mapPath2 = _interopRequireDefault(_mapPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

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
    var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

    _classCallCheck(this, Container);

    var _this = _possibleConstructorReturn(this, _Namespace.call(this, separator, '', new _storage2.default(separator)));

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


  Container.prototype.contains = function contains(path) {
    return this._storage.contains(path);
  };

  /**
   * Resolve a module.
   * @param {string} path - Module namespace.
   * @returns {Module} new Module.
   */


  Container.prototype.resolve = function resolve(path) {
    return this._resolver.resolve(path);
  };

  /**
   * Resolves all modules from particular namespace.
   * @param {string} namespace - Target namespace.
   * @returns {Map<string, any>} Map of module values, where key is module name.
   */


  Container.prototype.resolveAll = function resolveAll(namespace) {
    return this._resolver.resolveAll(namespace);
  };

  return Container;
}(_namespace2.default);

Container.map = _mapPath2.default;
exports.default = Container;