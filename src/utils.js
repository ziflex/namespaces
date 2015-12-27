const toString = Object.prototype.toString;

export function isUndefined(value) {
    return typeof value === 'undefined';
}

export function isNull(value) {
    return value === null;
}

export function isNullOrUndefined(arg) {
    return isNull(arg) || isUndefined(arg);
}

export function isObject(value) {
    return value !== null && typeof value === 'object';
}

export function isString(value) {
    return typeof value === 'string';
}

export function isFunction(value) {
    return typeof value === 'function';
}

export function isArray(value) {
    return toString.call(value) === '[object Array]';
}

export function create(constructor, args) {
    function Temp() {}
    Temp.prototype = constructor.prototype;
    const instance = new Temp();
    const result = constructor.apply(instance, args);
    return Object(result) === result ? result : instance;
}

export function parseArgs(...args) {
    const name = args[0];
    let dependencies = args[1];
    let definition = args[2];

    if (isUndefined(definition)) {
        definition = dependencies;
        dependencies = null;
    }

    return { name, dependencies, definition };
}

export function splitPath(path, separator = '/') {
    const parts = path.split(separator);
    const len = parts.length;
    return {
        namespace: len > 1 ? parts.slice(0, len - 1).join(separator) : separator,
        name: parts[len - 1]
    };
}

export function buildPath(separator = '/', ...parts) {
    return parts.join(separator);
}
