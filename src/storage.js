import Symbol from 'es6-symbol';
import Module from './module';
import {
    splitPath,
    joinPath,
    isString,
    isNullOrUndefined,
    isFunction,
    isValidName,
    forEach
} from './utils';

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
 * Creates a new Storage.
 * @class
 * @classdesc Represents a modules storage.
 */
export default class Storage {
    constructor(pathSeparator = '/') {
        this[FIELDS.separator] = pathSeparator;
        this[FIELDS.namespaces] = {};
    }

    /**
     * Adds module to storage.
     * @param {Module} module - Target module to add.
     * @throws {Error} Throws an error if module with same path already exists.
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

        if (!isValidName(this[FIELDS.separator], name)) {
            throw new Error(
                `${INVALID_MODULE_PATH} Module is now alllowed to contain namespace separators.`
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
     * Tries to find a module with passed path.
     * @param {string} path - Module's path.
     * @return {Module} found module.
     * @throws {Error} Throws error in module wasn't found.
     */
    getItem(path) {
        if (!isString(path)) {
            throw new Error(INVALID_MODULE_PATH);
        }

        const parts = splitPath(this[FIELDS.separator], path);
        const namespace = this[FIELDS.namespaces][parts.namespace];

        if (!namespace) {
            throw new Error(`${MODULE_NOT_FOUND}: ${path}!`);
        }

        const module = namespace[parts.name];

        if (!module) {
            throw new Error(`${MODULE_NOT_FOUND}: ${path}!`);
        }

        return module;
    }

    /**
     * Determines whether a module with passed path exists.
     * @param {string} path - Module's path.
     * @return {boolean} Value that determines whether a module with passed path exists.
     */
    contains(path) {
        if (!isString(path)) {
            throw new Error(INVALID_MODULE_PATH);
        }

        const parts = splitPath(this[FIELDS.separator], path);
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

    forEachIn(namespace, callback) {
        if (isNullOrUndefined(namespace)) {
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
            callback(value, joinPath(this[FIELDS.separator], namespace, name));
        });
    }
}
