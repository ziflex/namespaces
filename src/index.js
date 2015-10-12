import Module from './module';
import Initializer from './initializer';
import ContainerStorage from './storage';
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
        this._separator = separator;
        this._storage = new ContainerStorage(separator);
        this._resolver = new Resolver(this._storage);
    }

    /**
     * Register a module.
     * @param {string} namespace - Module namespace. Optional.
     * @returns {Module} new Module.
     */
    register(namespace) {
        let registered = false;
        return new Module((name, module) => {
            if (registered) {
                throw new Error('This module has been already registered');
            }

            const path = helper.buildPath(this._separator, namespace, name);
            const activator = new Initializer(path, module.create, module.dependencies);
            this._storage.addItem(path, activator);
            registered = true;
        });
    }

    /**
     * Resolve a module.
     * @param {string} path - Module namespace.
     * @returns {Module} new Module.
     */
    resolve(path) {
        return this._resolver.resolve(path);
    }
}
