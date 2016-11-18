import Symbol from 'es6-symbol';
import isFunction from 'is-function';
import path from './utils/path';
import create from './utils/create';
import parseArgs from './utils/args';
import Module from './module';
import { requires, assert } from './utils/assertions';

const INVALID_CONSTRUCTOR = 'Service supports only constructors';
const INVALID_FACTORY = 'Factory supports only functions';

const FIELDS = {
    separator: Symbol('separator'),
    name: Symbol('name'),
    storage: Symbol('storage')
};

/**
 * Represents a module namespace.
 */
class Namespace {

    /**
     * Creates a new instance of Namespace.
     * @param {Storage} storage - Modules storage.
     * @param {string} [name] - Namespace name.
     * @param {string} [separator] - Namespace separator.
     */
    constructor(storage, name = '', separator = '/') {
        requires(storage, 'storage');

        this[FIELDS.storage] = storage;
        this[FIELDS.name] = name;
        this[FIELDS.separator] = separator;
    }

    /**
     * Returns a namespace name.
     * @returns {string} Namespace name.
     */
    getName() {
        return this[FIELDS.name];
    }

    /**
     * Returns a sub namespace.
     * @param {string} name - Name of a sub namespace.
     * @returns {Namespace} Sub namespace.
     */
    namespace(name) {
        return new Namespace(
            this[FIELDS.storage],
            path.join(this[FIELDS.separator], this[FIELDS.name], name),
            this[FIELDS.separator]
        );
    }

    /**
     * Register a value, such as a string, a number, an array, an object or a function.
     * @param {string} name - Module name.
     * @param {(string|number|object|array|function)} definition - Module value.
     * @returns {Namespace} Returns current instance of Namespace.
     */
    const(name, definition) {
        requires(name, 'module name');

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

        return this;
    }

    /**
     * Registers a value, such as a string, a number, an array, an object or a function.
     * If passed value is a function, it will be invoked
     * with a `new` keyword everytime when it gets resolved.
     * @param {string} name - Module name.
     * @param {array} [dependencies = []] - Module dependencies.
     * @param {(string|number|object|array|function)} definition - Module value.
     * @returns {Namespace} Returns current instance of Namespace.
     */
    value(name, dependencies, definition) {
        requires(name, 'module name');

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

        return this;
    }

    /**
     * Registers a constructor of a singleton.
     * Given function will be invoked with a `new` keyword when it gets resolved.
     * @param {string} name - Module name.
     * @param {array} [dependencies=[]] - Module dependencies.
     * @param {function} definition - Module constructor that will be instantiated.
     * @returns {Namespace} Returns current instance of Namespace.
     */
    service(name, dependencies, definition) {
        requires(name, 'module name');

        const args = parseArgs(name, dependencies, definition);

        assert(
            isFunction(args.definition),
            `${INVALID_CONSTRUCTOR}: ${path.join(this[FIELDS.separator], this[FIELDS.name], name)}`
        );

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

        return this;
    }

    /**
     * Registers a factory of a singleton.
     * @param {string} name - Module name.
     * @param {array} [dependencies=[]] - Module dependencies.
     * @param {function} definition - Module factory.
     * @returns {Namespace} Returns current instance of Namespace.
     */
    factory(name, dependencies, definition) {
        requires(name, 'module name');

        const args = parseArgs(name, dependencies, definition);

        assert(
            isFunction(args.definition),
            `${INVALID_FACTORY}: ${path.join(this[FIELDS.separator], this[FIELDS.name], name)}`
        );

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

        return this;
    }
}

export default Namespace;
