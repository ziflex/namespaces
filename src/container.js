import Namespace from './namespace';
import Storage from './storage';
import Resolver from './resolver';
import mapPath from './map-path';

/**
 * Creates a new Container.
 * @class
 * @classdesc Represents a container for registered modules.
 */
export default class Container extends Namespace {
    /**
     * Converts object/array to a function chain that's help to use namespaces.
     */
    static map = mapPath;

    /** @constructs
     * @param {string} separator - Namespace separator. Optional. Default '/'.
     */
    constructor(separator = '/') {
        super(separator, '', new Storage(separator));
        this._resolver = new Resolver(this._storage);
    }

    /**
     * Determines whether a module with passed path exists.
     * @param {string} path - Module's path.
     * @return {boolean} Value that determines whether a module with passed path exists.
     */
    contains(path) {
        return this._storage.contains(path);
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
