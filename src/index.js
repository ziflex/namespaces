import Symbol from 'es6-symbol';
import Namespace from './namespace';
import Storage from './storage';
import Resolver from './resolver';
import parseSettings from './utils/settings';
import path from './utils/path';

const FIELDS = {
    resolver: Symbol('resolver')
};

/**
 * Represents a container for registered modules.
 */
class Container extends Namespace {
    /**
     * Converts object/array to a function chain that's help to use namespaces.
     * @param {(Object|Array<any>)} namespaces - An object or an array of nested namespace names.
     * @param {string} [separator] - Namespace separator.
     * @returns {function} Chain of functions that converts a module name into a full module path.
     */
    static map(namespaces, separator = '/') {
        return path.map(namespaces, separator);
    }

    /**
     * Creates a new instance of Container.
     * @param {string} [params="/"] - Namespace separator.
     * @param {object} [params=null] - Container settings.
     * @param {string} [params.separator="/"] - Namespace separator.
     * @param {boolean} [params.panic=false] - Indicates whether it needs to throw an error when module not found.
     */
    constructor(params) {
        const settings = parseSettings(params);
        const storage = new Storage(settings.separator, settings.panic);

        super(storage, '', settings.separator);

        this[FIELDS.resolver] = new Resolver(storage);
    }

    /**
     * Resolves a module by a given full path.
     * @param {string} fullPath - Module's full path.
     * @returns {any} Module value.
     */
    resolve(fullPath) {
        return this[FIELDS.resolver].resolve(fullPath);
    }

    /**
     * Resolves all modules from a given namespace.
     * @param {string} namespace - Target namespace.
     * @returns {Map<string, any>} Map of module values, where key is module name.
     */
    resolveAll(namespace) {
        return this[FIELDS.resolver].resolveAll(namespace);
    }
}

export default Container;
