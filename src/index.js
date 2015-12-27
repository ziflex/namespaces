import Namespace from './namespace';
import Storage from './storage';
import Resolver from './resolver';

/**
 * Creates a new Container.
 * @class
 * @classdesc Represents a container for registered modules.
 */
export default class Container {
    /** @constructs
     * @param {string} separator - Namespace separator. Optional. Default '/'.
     */
    constructor(separator = '/') {
        this._separator = separator;
        this._storage = new Storage(separator);
        this._resolver = new Resolver(this._storage);
    }

    /**
     * Register a module.
     * @param {string} namespace - Module namespace. Optional.
     * @returns {Namespace} Module namespace.
     */
    register(namespace) {
        return new Namespace(namespace || this._separator, this._storage);
    }

    /**
     * Resolve a module.
     * @param {string} path - Module namespace.
     * @returns {Module} new Module.
     */
    resolve(path) {
        return this._resolver.resolve(path);
    }

    /**
     * Resolves all modules from particular namespace.
     * @param {string} namespace - Target namespace.
     * @returns {Map<string, any>} Map of module values, where key is module name.
     */
    resolveAll(namespace) {
        return this._resolver.resolveAll(namespace);
    }
}
