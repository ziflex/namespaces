import helper from './helper';

export default class Initializer {
    constructor(path, initialization, dependencies) {
        this._path = path;
        this._initialization = initialization;
        this._dependencies = dependencies;
        this._isInitialized = false;
        this._value = null;
    }

    getPath() {
        return this._path;
    }

    getDependencies() {
        return this._dependencies;
    }

    getIsInitialized() {
        return this._isInitialized;
    }

    initialize(dependencies) {
        if (this.getIsInitialized()) {
            throw new Error(`Module ${this._path} has been already initialized!`);
        }

        this._value = this._initialization(dependencies);
        this._isInitialized = true;
    }

    instance() {
        if (helper.isFunction(this._value)) {
            return this._value();
        }

        return this._value;
    }
}
