import { isArray } from './utils';

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

            const deps = module.getDependencies();
            let resolvedDeps = [];
            if (isArray(deps)) {
                resolvedDeps = deps.map(resolveModule);
            }

            module.initialize(resolvedDeps);
            return module.getValue();
        };

        return resolveModule(path);
    }
}
