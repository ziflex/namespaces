import Symbol from 'es6-symbol';
import isNil from 'is-nil';
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
 * Represents a dependency resolver.
 */
class Resolver {

    /**
     * Creates a new instance of Namespace.
     * @param storage - Module's storage.
     */
    constructor(storage) {
        this[FIELDS.storage] = storage;
    }

    /**
     * Resolves a module by given full path.
     * @param {string} fullPath - Full path of a module.
     * @returns {any} Value of resolved module.
     */
    resolve(fullPath) {
        const graph = [];
        const chain = [];
        const checkCircularDependency = (targetPath, dependencies) => {
            forEach(dependencies, i => graph.push([targetPath, i]));
            chain.push(...dependencies);

            try {
                toposort(graph);
            } catch (e) {
                throw new ReferenceError(`${CIRC_REF}: ${fullPath} -> ${chain.join(' -> ')}`);
            }
        };
        const resolveModule = (targetPath) => {
            const module = this[FIELDS.storage].getItem(targetPath);

            if (isNil(module)) {
                return null;
            }

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

        return resolveModule(fullPath);
    }

    /**
     * Resolves all modules by a given namespace name.
     * @param {string} namespace - Target namespace name.
     * @returns {Map<string, any>} Map of module values, where key is a module name.
     */
    resolveAll(namespace) {
        const result = {};

        this[FIELDS.storage].forEachIn(namespace, (module, path) => {
            result[module.getName()] = this.resolve(path);
        });

        return result;
    }
}

export default Resolver;
