import helper from './helper';

/**
 * Creates a new Module.
 * @class
 * @classdesc Represents a registered module.
 */
export default class Module {
    /** @constructor
     * @param {function} callback - Callback function for registering current module in container.
     */
    constructor(callback) {
        this._callback = callback;
    }

    /**
     * Register a value, such as a string, a number, an array, an object or a constructor.
     * Note: If passed value is function type, it will be treated as constructor
     * and every time when it's injected, new instance will be created.
     * @param {string} name - Module name.
     * @param {array} dependencies - Module dependencies. Optional.
     * @param {string | number | object | array | function} definition - Module value.
     * @returns {function} Value factory.
     */
    value(name, dependencies, definition) {
        const args = helper.normalizeArguments(name, dependencies, definition);

        this._callback(args.name, {
            dependencies: args.dependencies,
            create: (resolved) => {
                // instances, simple types
                if (!helper.isFunction(args.definition)) {
                    return args.definition;
                }

                return function factory() {
                    return helper.create(args.definition, resolved);
                };
            }
        });
    }

    /**
     * Register a service constructor, which will be invoked with `new` to create the service instance.
     * Any type which was registered as a service is singleton.
     * @param {string} name - Module name.
     * @param {array} dependencies - Module dependencies. Optional.
     * @param {function} definition - Module constructor that will be instantiated.
     * @returns {function} Value factory.
     */
    service(name, dependencies, definition) {
        const args = helper.normalizeArguments(name, dependencies, definition);

        if (!helper.isFunction(args.definition)) {
            throw new Error(`Service supports only constructors.`);
        }

        this._callback(args.name, {
            dependencies: args.dependencies,
            create: (resolved) => {
                return helper.create(args.definition, resolved);
            }
        });
    }

    /**
     * Register a service factory, which will be called to return the service instance.
     * Any function's value will be registered as a singleton.
     * @param {string} name - Module name.
     * @param {array} dependencies - Module dependencies. Optional.
     * @param {function} definition - Module factory.
     * @returns {function} Value factory.
     */
    factory(name, dependencies, definition) {
        const args = helper.normalizeArguments(name, dependencies, definition);

        if (!helper.isFunction(args.definition)) {
            throw new Error(`Factory supports only functions.`);
        }

        this._callback(args.name, {
            dependencies: args.dependencies,
            create: (resolved) => {
                return args.definition(...resolved);
            }
        });
    }
}
