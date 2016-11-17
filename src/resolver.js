import Symbol from 'es6-symbol';
import isString from 'is-string';
import isFunction from 'is-function';
import isArray from 'is-array';
import forEach from 'for-each';
import toposort from 'toposort';

const DEFAULT_DEPENDENCIES = [];
const CIRC_REF = 'Circular dependency is detected';

const FIELDS = {
    storage: Symbol('storage')
};

/**
 * Creates a new Resolver.
 * @class
 * @classdesc Represents a dependency resolver for particular module.
 */
export default class Resolver {
    /**
     * @constructor
     * @param storage - Module's storage.
     */
    constructor(storage) {
        this[FIELDS.storage] = storage;
    }

    /**
     * Resolves particular module.
     * @returns {any} Module's value.
     */
    resolve(path) {
        const graph = [];
        const chain = [];
        const checkCircularDependency = (targetPath, dependencies) => {
            forEach(dependencies, i => graph.push([targetPath, i]));
            chain.push(...dependencies);
            try {
                toposort(graph);
            } catch (e) {
                throw new ReferenceError(`${CIRC_REF}: ${path} -> ${chain.join(' -> ')}`);
            }
        };
        const resolveModule = (targetPath) => {
            const module = this[FIELDS.storage].getItem(targetPath);

            if (module.isInitialized()) {
                return module.getValue();
            }

            const resolveDependencies = (dependencies) => {
                if (isArray(dependencies)) {
                    checkCircularDependency(targetPath, dependencies);
                    return dependencies.map((currentPath) => {
                        if (isString(currentPath)) {
                            return resolveModule(currentPath);
                        } else if (isFunction(currentPath)) {
                            return currentPath();
                        }

                        return undefined;
                    });
                }

                if (isFunction(dependencies)) {
                    const result = dependencies();

                    if (!isArray(result)) {
                        return [result];
                    }

                    return result;
                }

                return DEFAULT_DEPENDENCIES;
            };

            module.initialize(resolveDependencies(module.getDependencies()));
            return module.getValue();
        };

        return resolveModule(path);
    }

    /**
     * Resolves all modules from particular namespace.
     * @param {string} namespace - Target namespace.
     * @returns {Map<string, any>} Map of module values, where key is module name.
     */
    resolveAll(namespace) {
        const result = {};

        this[FIELDS.storage].forEachIn(namespace, (module, path) => {
            result[module.getName()] = this.resolve(path);
        });

        return result;
    }
}
