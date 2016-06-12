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

    /**
     * Returns module namespace.
     * @returns {string} Module namespace.
     */
    getNamespace() {
        return this._namespace;
    }

    /**
     * Returns module name.
     * @returns {string} Module name.
     */
    getName() {
        return this._name;
    }

    /**
     * Returns a list of module dependencies.
     * @returns {(Array<string>|undefined)} List of module dependencies.
     */
    getDependencies() {
        return this._dependencies;
    }

    /**
     * Returns initialized module value.
     * @returns {any} Modules value.
     * @throws {Error} Throws error if modules is not initialized.
     */
    getValue() {
        if (!this.isInitialized()) {
            throw new Error('Module is not initialized!');
        }

        return this._value();
    }

    /**
     * Returns value that determines whether module is initialized.
     * @returns {boolean} Value that determines whether module is initialized.
     */
    isInitialized() {
        return this._isInitialized;
    }

    /**
     * Initializes module.
     * @throws {Error} Throws error if modules is already initialized.
     */
    initialize(dependencies) {
        if (this.isInitialized()) {
            throw new Error(
                `Module has been already initialized: ${this._name} @ ${this._namespace}`
            );
        }

        this._value = this._initialize(dependencies);
        this._isInitialized = true;
    }
}
