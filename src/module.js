import { isFunction } from './utils';

/**
 * Creates a new Module.
 * @class
 * @classdesc Represents a module.
 */
export default class Module {
    constructor(namespace, name, dependencies, initialize) {
        this._namespace = namespace;
        this._name = name;
        this._initialize = initialize;
        this._dependencies = dependencies;
        this._isInitialized = false;
        this._value = null;
    }

    getNamespace() {
        return this._namespace;
    }

    getName() {
        return this._name;
    }

    getDependencies() {
        return this._dependencies;
    }

    getValue() {
        if (!this.isInitialized()) {
            throw new Error('Module is not initialized!');
        }

        if (isFunction(this._value)) {
            return this._value();
        }

        return this._value;
    }

    isInitialized() {
        return this._isInitialized;
    }

    initialize(dependencies) {
        if (this.isInitialized()) {
            throw new Error(`Module has been already initialized!`);
        }

        this._value = this._initialize(dependencies);
        this._isInitialized = true;
    }
}
