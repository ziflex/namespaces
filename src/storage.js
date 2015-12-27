import Module from './module';
import {
    splitPath,
    buildPath,
    isString,
    isNullOrUndefined,
    isFunction
} from './utils';

const MISSED_MODULE = 'Missed module!';
const MISSED_MODULE_NAME = 'Missed module name!';
const MISSED_NAMESPACE = 'Missed module namespace!';
const MISSED_CALLBACK = 'Missed callback';
const INVALID_MODULE = 'Invalid module!';
const INVALID_NAMESPACE = 'Invalid namespace!';
const INVALID_MODULE_NAME = 'Invalid module name!';
const INVALID_MODULE_PATH = 'Invalid module path!';
const NAMESPACE_NOT_FOUND = 'Namespace was not found';
const MODULE_NOT_FOUND = 'Module with path was not found';

/**
 * Creates a new Storage.
 * @class
 * @classdesc Represents a modules storage.
 */
export default class Storage {
    constructor(pathSeparator = '/') {
        this._separator = pathSeparator;
        this._namespaces = {};
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

        let registry = this._namespaces[namespace];

        if (!registry) {
            registry = {};
            this._namespaces[namespace] = registry;
        }

        if (registry[name]) {
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

        const parts = splitPath(path, this._separator);
        const namespace = this._namespaces[parts.namespace];

        if (!namespace) {
            throw new Error(`${NAMESPACE_NOT_FOUND}: ${parts.namespace}!`);
        }

        const module = namespace[parts.name];

        if (!module) {
            throw new Error(`${MODULE_NOT_FOUND}: ${parts.name}!`);
        }

        return module;
    }

    forEachIn(namespace, callback) {
        if (isNullOrUndefined(namespace)) {
            throw new Error(MISSED_NAMESPACE);
        }

        if (!isFunction(callback)) {
            throw new Error(MISSED_CALLBACK);
        }

        const registry = this._namespaces[namespace];

        if (!registry) {
            throw new Error(`${NAMESPACE_NOT_FOUND}: ${namespace}!`);
        }

        for (const name in registry) {
            if (registry.hasOwnProperty(name) && registry[name]) {
                callback(registry[name], buildPath(this._separator, namespace, name));
            }
        }
    }
}
