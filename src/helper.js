const toString = Object.prototype.toString;
export default {
    isUndefined(value) {
        return typeof value === 'undefined';
    },
    isNull(value) {
        return value === null;
    },
    isObject(value) {
        return value !== null && typeof value === 'object';
    },
    isString(value) {
        return typeof value === 'string';
    },
    isFunction(value) {
        return typeof value === 'function';
    },
    isArray(value) {
        return toString.call(value) === '[object Array]';
    },
    create(constructor, args) {
        function Temp() {}
        Temp.prototype = constructor.prototype;
        const instance = new Temp();
        const result = constructor.apply(instance, args);
        return Object(result) === result ? result : instance;
    },
    normalizeArguments(...args) {
        const name = args[0];
        let dependencies = args[1];
        let definition = args[2];

        if (this.isUndefined(definition)) {
            definition = dependencies;
            dependencies = null;
        }

        return { name, dependencies, definition };
    },
    parsePath(path, separator = '/') {
        const parts = path.split(separator);
        const len = parts.length;

        return {
            namespace: len > 1 ? parts.slice(0, len - 1).join(separator) : separator,
            name: parts[len - 1]
        };
    }
};
