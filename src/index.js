import Symbol from 'es6-symbol';
import isString from 'is-string';
import Namespace from './namespace';
import Storage from './storage';
import Resolver from './resolver';
import parseSettings from './utils/settings';
import path from './utils/path';
import { requires, assert } from './utils/assertions';

const INVALID_MODULE_PATH = 'Invalid module path';
const INVALID_INPUT_TYPE = 'Invalid input type';

const FIELDS = {
    resolver: Symbol('resolver'),
    storage: Symbol('storage')
};

function getNamespace(input) {
    if (!input) {
        return null;
    }

    let result = null;

    if (isString(input)) {
        result = input;
    } else if (input instanceof Namespace) {
        result = input.getName();
    } else {
        throw new Error(INVALID_INPUT_TYPE);
    }

    return result;
}

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

        // Ouch! We have to keep ref twice :(
        this[FIELDS.storage] = storage;
        this[FIELDS.resolver] = new Resolver(this[FIELDS.storage]);
    }

    /**
     * Determines whether a module exists by a given path.
     * @param {string} fullPath - Module full path.
     * @return {boolean} Value that determines whether a module exists by a given path.
     */
    contains(fullPath) {
        requires('full path', fullPath);
        assert(isString(fullPath), INVALID_MODULE_PATH);

        return this[FIELDS.storage].contains(fullPath);
    }

    /**
     * Returns size of whole container or a namespace.
     * If namespace was given, count of items inside this namespace will be returned.
     * @param {(Namespace|string)} [namespace=undefine] Namespace or namespace name
     * @returns {number} Size of a container/namespace.
     */
    size(namespace) {
        return this[FIELDS.storage].size(getNamespace(namespace));
    }

    /**
     * Clears a container or a given namespace.
     * If namespace name is passed - removes all modules in the namespace.
     * @param {(Namespace|string)} [namespace=undefine] Namespace or namespace name
     * @returns {Container} Returns current instance of Container.
     */
    clear(namespace) {
        this[FIELDS.storage].clear(getNamespace(namespace));

        return this;
    }

    /**
     * Resolves a module by a given full path.
     * @param {string} fullPath - Module's full path.
     * @returns {any} Module value.
     */
    resolve(fullPath) {
        requires('full path', fullPath);
        assert(isString(fullPath), INVALID_MODULE_PATH);

        return this[FIELDS.resolver].resolve(fullPath);
    }

    /**
     * Resolves all modules from a given namespace.
     * @param {(Namespace|string)} namespace - Namespace or namespace name
     * @param {boolean} [nested=false] - Value that detects whether it needs to resolve modules from nested namespaces.
     * If 'true', all resolved values will be put into an array.
     * @returns {Map<string, (any|Array<any>)>} Map of module values, where key is a module name.
     */
    resolveAll(namespace, nested = false) {
        requires('namespace', namespace);

        return this[FIELDS.resolver].resolveAll(getNamespace(namespace), nested);
    }
}

module.exports = Container;
