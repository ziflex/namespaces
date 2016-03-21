import {
    isFunction,
    create,
    parseArgs,
    joinPath
} from './utils';
import Module from './module';

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
        this._separator = separator;
        this._name = name;
        this._storage = storage;
    }

    /**
     * Returns a namespace name.
     * @returns {string} Namespace name.
     */
    getName() {
        return this._name;
    }

    /**
     * Returns a module namespace.
     * @param {string} name - Module namespace. Optional.
     * @returns {Namespace} Module namespace.
     */
    namespace(name) {
        return new Namespace(this._separator, joinPath(this._separator, this._name, name), this._storage);
    }

    /**
     * Register a value, such as a string, a number, an array, an object or a function.
     * @param {string} name - Module name.
     * @param {(string|number|object|array|function)} definition - Module value.
     * @returns {function} Value.
     */
    const(name, definition) {
        const args = parseArgs(name, definition);

        this._storage.addItem(new Module(this._name, args.name, args.dependencies, function initialize() {
            return function factory() {
                return args.definition;
            };
        }));
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

        this._storage.addItem(new Module(this._name, args.name, args.dependencies, function initialize(resolved) {
            // instances, simple types
            if (!isFunction(args.definition)) {
                return args.definition;
            }

            return function factory() {
                return create(args.definition, resolved);
            };
        }));
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
        const args = parseArgs(name, dependencies, definition);

        if (!isFunction(args.definition)) {
            throw new Error(`Service supports only constructors.`);
        }

        this._storage.addItem(new Module(this._name, args.name, args.dependencies, function initialize(resolved) {
            return create(args.definition, resolved);
        }));
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
            throw new Error(`Factory supports only functions.`);
        }

        this._storage.addItem(new Module(this._name, args.name, args.dependencies, function initialize(resolved) {
            return args.definition(...resolved);
        }));
    }
}