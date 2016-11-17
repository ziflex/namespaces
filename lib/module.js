'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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


    Module.prototype.getNamespace = function getNamespace() {
        return this._namespace;
    };

    /**
     * Returns module name.
     * @returns {string} Module name.
     */


    Module.prototype.getName = function getName() {
        return this._name;
    };

    /**
     * Returns a list of module dependencies.
     * @returns {(Array<string>|undefined)} List of module dependencies.
     */


    Module.prototype.getDependencies = function getDependencies() {
        return this._dependencies;
    };

    /**
     * Returns initialized module value.
     * @returns {any} Modules value.
     * @throws {Error} Throws error if modules is not initialized.
     */


    Module.prototype.getValue = function getValue() {
        if (!this.isInitialized()) {
            throw new Error('Module is not initialized!');
        }

        return this._value();
    };

    /**
     * Returns value that determines whether module is initialized.
     * @returns {boolean} Value that determines whether module is initialized.
     */


    Module.prototype.isInitialized = function isInitialized() {
        return this._isInitialized;
    };

    /**
     * Initializes module.
     * @throws {Error} Throws error if modules is already initialized.
     */


    Module.prototype.initialize = function initialize(dependencies) {
        if (this.isInitialized()) {
            throw new Error('Module has been already initialized: ' + this._name + ' @ ' + this._namespace);
        }

        this._value = this._initialize(dependencies);
        this._isInitialized = true;
    };

    return Module;
}();

exports.default = Module;