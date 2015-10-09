import Module from './module';
import Resolver from './resolver';
import helper from './helper';

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
        this._namespaces = {};
        this._separator = separator;
    }

    /**
     * Register a module.
     * @param {string} namespace - Module namespace. Optional.
     * @returns {Module} new Module.
     */
    register(namespace) {
        const targetNamespace = namespace || this._separator;
        let registered = false;
        return new Module((name, value) => {
            if (registered) {
                throw new Error('This module already registered');
            }

            let registry = this._namespaces[targetNamespace];
            if (!registry) {
                registry = {};
                this._namespaces[targetNamespace] = registry;
            }

            if (registry[name]) {
                throw new Error(`${name} is already registered.`);
            }

            registry[name] = new Resolver(this, value);
            registered = true;
        });
    }

    /**
     * Resolve a module.
     * @param {string} path - Module namespace.
     * @returns {Module} new Module.
     */
    resolve(path) {
        const parts = helper.parsePath(path, this._separator);
        const namespace = this._namespaces[parts.namespace];

        if (!namespace) {
            throw new Error(`Namespace '${parts.namespace}' was not found.`);
        }

        const module = namespace[parts.name];

        if (!module) {
            throw new Error(`Module with path '${path}' was not found.`);
        }

        return module.resolve();
    }
}
