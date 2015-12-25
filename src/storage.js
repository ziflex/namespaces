import Module from './module';
import helper from './helper';

const MISSED_MODULE_NAME = 'Missed module name!';
const MISSED_MODULE = 'Missed module!';
const INVALID_MODULE_TYPE = 'Invalid module type!';
const INVALID_NAMESPACE_TYPE = 'Invalid namespace tyoe!';

export default class Storage {
    constructor(pathSeparator = '/') {
        this._separator = pathSeparator;
        this._namespaces = {};
    }

    addItem(module) {
        if (!module) {
            throw new Error(MISSED_MODULE);
        }

        if (!(module instanceof Module)) {
            throw new Error(INVALID_MODULE_TYPE);
        }

        if (!helper.isString(module.getNamespace())) {
            throw new Error(INVALID_NAMESPACE_TYPE);
        }

        if (!module.getName()) {
            throw new Error(MISSED_MODULE_NAME);
        }

        const namespace = module.getNamespace();
        let registry = this._namespaces[namespace];

        if (!registry) {
            registry = {};
            this._namespaces[namespace] = registry;
        }

        const name = module.getName();

        if (registry[name]) {
            throw new Error(`${name} is already registered.`);
        }

        registry[name] = module;
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
