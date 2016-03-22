import {
    isString,
    isArray,
    isFunction,
    reduce,
    forEach
} from './utils';

const DEFAULT_DEPENDENCIES = [];

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
        this._storage = storage;
    }

    /**
     * Resolves particular module.
     * @returns {any} Module's value.
     */
    resolve(path) {
        const resolveModule = (targetPath) => {
            const module = this._storage.getItem(targetPath);

            if (module.isInitialized()) {
                return module.getValue();
            }

            const resolveDependencies = (dependencies) => {
                if (isArray(dependencies)) {
                    return reduce(dependencies, (result, currentPath) => {
                        const all = result;
                        let current = null;

                        if (isString(currentPath)) {
                            current = resolveModule(currentPath);
                        } else {
                            current = resolveDependencies(currentPath);
                        }

                        if (isArray(current)) {
                            forEach(current, i => all.push(i));
                        } else {
                            all.push(current);
                        }

                        return all;
                    }, []);
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

        this._storage.forEachIn(namespace, (module, path) => {
            result[module.getName()] = this.resolve(path);
        });

        return result;
    }
}
