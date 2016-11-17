import Symbol from 'es6-symbol';
import Namespace from './namespace';
import Storage from './storage';
import Resolver from './resolver';
import path from './utils/path';

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
    static map = path.map;

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
     * @param {string} fullPath - Module full path.
     * @returns {any} module value.
     */
    resolve(fullPath) {
        return this[FIELDS.resolver].resolve(fullPath);
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
