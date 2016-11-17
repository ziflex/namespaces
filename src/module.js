import Symbol from 'es6-symbol';

const NOT_INIT_YET = 'Module is not initialized';
const ALREADY_INIT = 'Module has been already initialized';

const FIELDS = {
    namespace: Symbol('namespace'),
    name: Symbol('name'),
    initialize: Symbol('initialize'),
    dependencies: Symbol('dependencies'),
    isInitialized: Symbol('isInitialized'),
    value: Symbol('value')
};

/**
 * Creates a new Module.
 * @class
 * @classdesc Represents a module.
 */
export default class Module {
    constructor(namespace, name, dependencies, initialize) {
        this[FIELDS.namespace] = namespace;
        this[FIELDS.name] = name;
        this[FIELDS.initialize] = initialize;
        this[FIELDS.dependencies] = dependencies;
        this[FIELDS.isInitialized] = false;
        this[FIELDS.value] = null;
    }

    /**
     * Returns module namespace.
     * @returns {string} Module namespace.
     */
    getNamespace() {
        return this[FIELDS.namespace];
    }

    /**
     * Returns module name.
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
     * @throws {Error} Throws error if modules is not initialized.
     */
    getValue() {
        if (!this.isInitialized()) {
            throw new Error(NOT_INIT_YET);
        }

        return this[FIELDS.value]();
    }

    /**
     * Returns value that determines whether module is initialized.
     * @returns {boolean} Value that determines whether module is initialized.
     */
    isInitialized() {
        return this[FIELDS.isInitialized];
    }

    /**
     * Initializes module.
     * @throws {Error} Throws error if modules is already initialized.
     */
    initialize(dependencies) {
        if (this.isInitialized()) {
            throw new Error(
                `${ALREADY_INIT}: ${this[FIELDS.name]} @ ${this[FIELDS.namespace]}`
            );
        }

        this[FIELDS.value] = this[FIELDS.initialize](dependencies);
        this[FIELDS.isInitialized] = true;
    }
}
