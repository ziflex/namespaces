import Symbol from 'es6-symbol';

const NOT_INIT_YET = 'Module is not initialized';
const ALREADY_INIT = 'Module has been already initialized';

const FIELDS = {
    namespace: Symbol('namespace'),
    name: Symbol('name'),
    initializer: Symbol('initializer'),
    dependencies: Symbol('dependencies'),
    isInitialized: Symbol('isInitialized'),
    value: Symbol('value')
};

/**
 * Represents a namespace module.
 */
class Module {

    /**
     * Creates a new instance of Module.
     * @param {string} namespace - Namespace name.
     * @param {string} name - Module name.
     * @param {Array<string>} [dependencies=undefined] - Module dependencies.
     * @param {function} initializer - Module initializer.
     */
    constructor(namespace, name, dependencies, initializer) {
        this[FIELDS.namespace] = namespace;
        this[FIELDS.name] = name;
        this[FIELDS.initializer] = initializer;
        this[FIELDS.dependencies] = dependencies;
        this[FIELDS.isInitialized] = false;
        this[FIELDS.value] = null;
    }

    /**
     * Returns a module namespace name.
     * @returns {string} Module namespace.
     */
    getNamespace() {
        return this[FIELDS.namespace];
    }

    /**
     * Returns a module name.
     * @returns {string} Module name.
     */
    getName() {
        return this[FIELDS.name];
    }

    /**
     * Returns a list of module dependencies.
     * @returns {(Array<string>|undefined)} List of module dependencies.
     */
    getDependencies() {
        return this[FIELDS.dependencies];
    }

    /**
     * Returns initialized module value.
     * @returns {any} Modules value.
     * @throws {Error} If a module is not initialized.
     */
    getValue() {
        if (!this.isInitialized()) {
            throw new Error(NOT_INIT_YET);
        }

        return this[FIELDS.value]();
    }

    /**
     * Returns a value that determines whether a module is initialized.
     * @returns {boolean} Value that determines whether a module is initialized.
     */
    isInitialized() {
        return this[FIELDS.isInitialized];
    }

    /**
     * Initializes a module.
     * @returns {Module} Returns current instance of Module.
     * @throws {Error} If a module is already initialized.
     */
    initialize(dependencies) {
        if (this.isInitialized()) {
            throw new Error(
                `${ALREADY_INIT}: ${this[FIELDS.name]} @ ${this[FIELDS.namespace]}`
            );
        }

        this[FIELDS.value] = this[FIELDS.initializer](dependencies);
        this[FIELDS.isInitialized] = true;

        return this;
    }
}

export default Module;
