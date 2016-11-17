import Symbol from 'es6-symbol';
import isFunction from 'is-function';
import path from './utils/path';
import create from './utils/create';
import parseArgs from './utils/args';
import Module from './module';

const INVALID_CONSTRUCTOR = 'Service supports only constructors';
const INVALID_FACTORY = 'Factory supports only functions';

const FIELDS = {
    separator: Symbol('separator'),
    name: Symbol('name'),
    storage: Symbol('storage')
};

/**
 * Creates a new Namespace.
 * @class
 * @classdesc Represents a module namespace.
 */
export default class Namespace {

    /** @constructor
     * @param {string} separator - Namespace separator.
     * @param {string} name - Namespace name.
     * @param {Storage} storage - Global modules storage.
     */
    constructor(separator = '/', name = '', storage) {
        this[FIELDS.separator] = separator;
        this[FIELDS.name] = name;
        this[FIELDS.storage] = storage;
    }

    /**
     * Returns a namespace name.
     * @returns {string} Namespace name.
     */
    getName() {
        return this[FIELDS.name];
    }

    /**
     * Determines whether a module with passed path exists.
     * @param {string} fullPath - Module full path.
     * @return {boolean} Value that determines whether a module with a given full path exists.
     */
    contains(fullPath) {
        return this[FIELDS.storage].contains(fullPath);
    }

    /**
     * Returns a module namespace.
     * @param {string} name - Module namespace. Optional.
     * @returns {Namespace} Module namespace.
     */
    namespace(name) {
        return new Namespace(
            this[FIELDS.separator],
            path.join(this[FIELDS.separator], this[FIELDS.name], name),
            this[FIELDS.storage]
        );
    }

    /**
     * Register a value, such as a string, a number, an array, an object or a function.
     * @param {string} name - Module name.
     * @param {(string|number|object|array|function)} definition - Module value.
     * @returns {function} Value.
     */
    const(name, definition) {
        const args = parseArgs(name, definition);

        this[FIELDS.storage].addItem(new Module(
            this[FIELDS.name],
            args.name,
            args.dependencies,
            () => {
                return function factory() {
                    return args.definition;
                };
            }
        ));
    }

    /**
     * Register a value, such as a string, a number, an array, an object or a constructor.
     * Note: If passed value is function type, it will be treated as constructor
     * and every time when it's injected, new instance will be created.
     * @param {string} name - Module name.
     * @param {array} dependencies - Module dependencies. Optional.
     * @param {(string|number|object|array|function)} definition - Module value.
     * @returns {function} Value factory.
     */
    value(name, dependencies, definition) {
        const args = parseArgs(name, dependencies, definition);

        this[FIELDS.storage].addItem(new Module(
            this[FIELDS.name],
            args.name,
            args.dependencies,
            (resolved) => {
                // instances, simple types
                if (!isFunction(args.definition)) {
                    return function factory() {
                        return args.definition;
                    };
                }

                return function factory() {
                    return create(args.definition, resolved);
                };
            }
        ));
    }

    /**
     * Register a service constructor,
     * which will be invoked with `new` to create the service instance.
     * Any type which was registered as a service is singleton.
     * @param {string} name - Module name.
     * @param {array} dependencies - Module dependencies. Optional.
     * @param {function} definition - Module constructor that will be instantiated.
     * @returns {function} Value factory.
     */
    service(name, dependencies, definition) {
        const args = parseArgs(name, dependencies, definition);

        if (!isFunction(args.definition)) {
            const fullPath = path.join(this[FIELDS.separator], this[FIELDS.name], name);
            throw new Error(`${INVALID_CONSTRUCTOR}: ${fullPath}`);
        }

        this[FIELDS.storage].addItem(new Module(
            this[FIELDS.name],
            args.name,
            args.dependencies,
            (resolved) => {
                const value = create(args.definition, resolved);

                return function factory() {
                    return value;
                };
            }
        ));
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
        const args = parseArgs(name, dependencies, definition);

        if (!isFunction(args.definition)) {
            const fullPath = path.join(this[FIELDS.separator], this[FIELDS.name], name);
            throw new Error(`${INVALID_FACTORY}: ${fullPath}`);
        }

        this[FIELDS.storage].addItem(new Module(
            this[FIELDS.name],
            args.name,
            args.dependencies,
            (resolved) => {
                const value = args.definition(...resolved);

                return function factory() {
                    return value;
                };
            }
        ));
    }
}
