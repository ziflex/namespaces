import helper from './helper';

export default class Storage {
    constructor(pathSeparator = '/') {
        this._separator = pathSeparator;
        this._namespaces = {};
    }

    addItem(path, module) {
        const parts = helper.splitPath(path, this._separator);
        parts.namespace = parts.namespace || this._separator;

        let registry = this._namespaces[parts.namespace];
        if (!registry) {
            registry = {};
            this._namespaces[parts.namespace] = registry;
        }

        if (registry[parts.name]) {
            throw new Error(`${parts.name} is already registered.`);
        }

        registry[parts.name] = module;
    }

    getItem(path) {
        const parts = helper.splitPath(path, this._separator);
        const namespace = this._namespaces[parts.namespace];

        if (!namespace) {
            throw new Error(`Namespace '${parts.namespace}' was not found.`);
        }

        const module = namespace[parts.name];

        if (!module) {
            throw new Error(`Module with path '${path}' was not found.`);
        }

        return module;
    }
}
