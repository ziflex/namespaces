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

const FIELDS = {
    separator: Symbol('separator'),
    namespaces: Symbol('namespaces')
};

/**
 * Represents a modules storage.
 */
class Storage {

    /**
     * Creates a new instance of Storage.
     * @param separator - Namespace separator.
     */
    constructor(separator = '/') {
        this[FIELDS.separator] = separator;
        this[FIELDS.namespaces] = {};
    }

    /**
     * Adds a module to a storage.
     * @param {Module} module - Target module to add.
     * @throws {Error} If a module with a same path already exists.
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
            this[FIELDS.namespaces][namespace] = registry;
        }

        if (registry.hasOwnProperty(name)) {
            throw new Error(`${name} is already registered.`);
        }

        registry[name] = module;
    }

    /**
     * Finds a module by a given path.
     * @param {string} fullPath - Module full path.
     * @return {Module} Found module.
     * @throws {Error} If module was not found.
     */
    getItem(fullPath) {
        if (!isString(fullPath)) {
            throw new Error(INVALID_MODULE_PATH);
        }

        const parts = path.split(this[FIELDS.separator], fullPath);
        const namespace = this[FIELDS.namespaces][parts.namespace];

        if (!namespace) {
            throw new Error(`${MODULE_NOT_FOUND}: ${fullPath}!`);
        }

        const module = namespace[parts.name];

        if (!module) {
            throw new Error(`${MODULE_NOT_FOUND}: ${fullPath}!`);
        }

        return module;
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
     * @returns {Namespace} Returns current instance on Storage.
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

        if (!registry) {
            throw new Error(`${NAMESPACE_NOT_FOUND}: ${namespace}!`);
        }

        forEach(registry, (value, name) => {
            callback(value, path.join(this[FIELDS.separator], namespace, name));
        });

        return this;
    }
}

export default Storage;
