import Symbol from 'es6-symbol';
import isNil from 'is-nil';
import isString from 'is-string';
import isFunction from 'is-function';
import forEach from 'for-each';
import Module from './module';
import path from './utils/path';

const MISSED_MODULE = 'Missed module';
const MISSED_MODULE_NAME = 'Missed module name';
const MISSED_NAMESPACE = 'Missed module namespace';
const MISSED_CALLBACK = 'Missed callback';
const INVALID_MODULE = 'Invalid module';
const INVALID_NAMESPACE = 'Invalid namespace';
const INVALID_MODULE_NAME = 'Invalid module name';
const INVALID_MODULE_PATH = 'Invalid module path';
const NAMESPACE_NOT_FOUND = 'Namespace was not found';
const MODULE_NOT_FOUND = 'Module with path was not found';

const REGISTRY_FIELDS = {
    size: Symbol('size')
};

const FIELDS = {
    separator: Symbol('separator'),
    panic: Symbol('panic'),
    namespaces: Symbol('namespaces'),
    size: Symbol('size')
};

/**
 * Represents a modules storage.
 */
class Storage {

    /**
     * Creates a new instance of Storage.
     * @param {string} [separator] - Namespace separator.
     * @param {boolean} [panic] - Indicates whether it needs to throw an error when module not found.
     */
    constructor(separator = '/', panic = true) {
        this[FIELDS.separator] = separator;
        this[FIELDS.panic] = panic;
        this[FIELDS.namespaces] = {};
        this[FIELDS.size] = 0;
    }

    /**
     * Returns size of a storage or namespace.
     * If namespace was given, count of items inside this namespace will be returned.
     * @param {string} [namespace=undefine] Namespace name
     * @returns {number} Size of a storage/namespace.
     */
    size(namespace) {
        let result = 0;

        const count = () => {
            result += 1;
        };

        if (isString(namespace)) {
            const registry = this[FIELDS.namespaces][namespace];

            forEach(registry, count);
        } else {
            forEach(this[FIELDS.namespaces], (registry) => {
                forEach(registry, count);
            });
        }

        return result;
    }

    /**
     * Adds a module to a storage.
     * @param {Module} module - Target module to add.
     * @throws {Error} If a module with a same path already exists.
     * @returns {Storage} Returns current instance of Storage.
     */
    addItem(module) {
        if (!module) {
            throw new Error(MISSED_MODULE);
        }

        if (!(module instanceof Module)) {
            throw new Error(INVALID_MODULE);
        }

        const namespace = module.getNamespace();

        if (!isString(namespace)) {
            throw new Error(INVALID_NAMESPACE);
        }

        const name = module.getName();

        if (!name) {
            throw new Error(MISSED_MODULE_NAME);
        }

        if (!isString(name)) {
            throw new Error(INVALID_MODULE_NAME);
        }

        if (!path.isValidName(this[FIELDS.separator], name)) {
            throw new Error(
                `${INVALID_MODULE_PATH} Module is not alllowed to contain namespace separators.`
            );
        }

        let registry = this[FIELDS.namespaces][namespace];

        if (!registry) {
            registry = {};
            registry[REGISTRY_FIELDS.size] = 0;
            this[FIELDS.namespaces][namespace] = registry;
        }

        if (registry.hasOwnProperty(name)) {
            throw new Error(`${name} is already registered.`);
        }

        registry[name] = module;
        registry[REGISTRY_FIELDS.size] += 1;
        this[FIELDS.size] += 1;

        return this;
    }

    /**
     * Finds a module by a given path.
     * @param {string} fullPath - Module full path.
     * @return {Module} Found module.
     * @throws {Error} If panic="true" and module not found.
     */
    getItem(fullPath) {
        if (!isString(fullPath)) {
            throw new Error(INVALID_MODULE_PATH);
        }

        const parts = path.split(this[FIELDS.separator], fullPath);
        const namespace = this[FIELDS.namespaces][parts.namespace];
        const panic = this[FIELDS.panic];

        if (!namespace) {
            if (panic) {
                throw new Error(`${MODULE_NOT_FOUND}: ${fullPath}!`);
            } else {
                return null;
            }
        }

        const module = namespace[parts.name];

        if (!module) {
            if (panic) {
                throw new Error(`${MODULE_NOT_FOUND}: ${fullPath}!`);
            } else {
                return null;
            }
        }

        return module;
    }

    /**
     * Clears a storage.
     * If namespace name is passed - clears a namespace by a given name.
     * @param {string} [namespace=null] - Namespace name to clear.
     * @returns {Storage} Returns current instance of Storage.
     */
    clear(namespace) {
        if (!isString(namespace)) {
            this[FIELDS.namespaces] = {};
            this[FIELDS.size] = 0;

            return this;
        }

        const registry = this[FIELDS.namespaces][namespace];

        if (!isNil(registry)) {
            this[FIELDS.size] -= registry[REGISTRY_FIELDS.size];
            this[FIELDS.namespaces][namespace] = {};
        }

        return this;
    }

    /**
     * Determines whether a module exists by a given path.
     * @param {string} path - Module full path.
     * @return {boolean} Value that determines whether a module exists by a given path.
     */
    contains(fullPath) {
        if (!isString(fullPath)) {
            throw new Error(INVALID_MODULE_PATH);
        }

        const parts = path.split(this[FIELDS.separator], fullPath);
        const namespace = this[FIELDS.namespaces][parts.namespace];

        if (!namespace) {
            return false;
        }

        const module = namespace[parts.name];

        if (!module) {
            return false;
        }

        return true;
    }

    /**
     * Iterates over modules in a given namespace.
     * @param {string} namespace - Namespace name.
     * @returns {Storage} Returns current instance on Storage.
     * @throws {Error} If panic="true" and namespace not found.
     */
    forEachIn(namespace, callback) {
        if (isNil(namespace)) {
            throw new Error(MISSED_NAMESPACE);
        }

        if (!isString(namespace)) {
            throw new Error(INVALID_NAMESPACE);
        }

        if (!isFunction(callback)) {
            throw new Error(MISSED_CALLBACK);
        }

        const registry = this[FIELDS.namespaces][namespace];
        const panic = this[FIELDS.panic];

        if (!registry) {
            if (panic) {
                throw new Error(`${NAMESPACE_NOT_FOUND}: ${namespace}!`);
            } else {
                return this;
            }
        }

        forEach(registry, (value, name) => {
            callback(value, path.join(this[FIELDS.separator], namespace, name));
        });

        return this;
    }
}

export default Storage;
