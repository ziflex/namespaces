import Symbol from 'es6-symbol';
import Namespace from './namespace';
import Storage from './storage';
import Resolver from './resolver';
import mapPath from './map-path';

const FIELDS = {
    resolver: Symbol('resolver')
};

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
        const storage = new Storage(separator);

        super(separator, '', storage);

        this[FIELDS.resolver] = new Resolver(storage);
    }

    /**
     * Resolve a module.
     * @param {string} path - Module namespace.
     * @returns {Module} new Module.
     */
    resolve(path) {
        return this[FIELDS.resolver].resolve(path);
    }

    /**
     * Resolves all modules from particular namespace.
     * @param {string} namespace - Target namespace.
     * @returns {Map<string, any>} Map of module values, where key is module name.
     */
    resolveAll(namespace) {
        return this[FIELDS.resolver].resolveAll(namespace);
    }
}
