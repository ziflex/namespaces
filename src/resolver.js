import helper from './helper';

/**
 * Creates a new Resolver.
 * @class
 * @classdesc Represents a dependency resolver for particular module.
 */
export default class Resolver {
    /**
     * @constructor
     * @param container - Parent container.
     * @param module - Target module.
     */
    constructor(container, module) {
        this._container = container;
        this._module = module;
        this._result = null;
    }

    /**
     * Resolves particular module.
     * @returns {any} Module's value.
     */
    resolve() {
        if (this._result) {
            return this._result();
        }

        let dependencies = [];

        if (helper.isArray(this._module.dependencies)) {
            dependencies = this._module.dependencies.map(this._container.resolve.bind(this._container));
        }

        this._result = function getResult(val) {
            if (helper.isFunction(val)) {
                return val();
            }

            return val;
        }.bind(this, this._module.create(dependencies));

        return this._result();
    }
}
