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

export function isValidName(separator = '/', name) {
    return name.indexOf(separator) === -1;
}

export function joinPath(separator = '/', ...parts) {
    const paths = [];
    const len = parts.length;

    for (let i = 0; i <= len; i += 1) {
        let part = parts[i];

        if (isString(part)) {
            part = part.trim();

            if (part && part !== separator) {
                paths.push(part);
            }
        }
    }

    return `${paths.join(separator)}`;
}

export function splitPath(separator = '/', path) {
    const result = { namespace: '', name: '' };

    if (!isString(path)) {
        return result;
    }

    const normalizedPath = path.trim();

    if (normalizedPath === separator) {
        result.namespace = '';
        return result;
    }

    const parts = normalizedPath.split(separator);
    const len = parts.length;

    if (len > 1) {
        result.namespace = joinPath(separator, ...parts.slice(0, len - 1));
    } else {
        result.namespace = '';
    }

    result.name = parts[len - 1] || '';

    if (isString(result.name) && !result.name.trim()) {
        result.name = '';
    }

    return result;
}

export function forEach(collection, iteratee, context = this) {
    if (isArray(collection)) {
        for (let i = 0; i < collection.length; i += 1) {
            iteratee.call(context, collection[i], i);
        }
    } else if (isObject(collection)) {
        for (const prop in collection) {
            if (collection.hasOwnProperty(prop)) {
                iteratee.call(context, collection[prop], prop);
            }
        }
    }
}

export function map(collection, iteratee, context = this) {
    const result = [];

    forEach(collection, (v, k) => {
        result.push(iteratee.call(context, v, k));
    });

    return result;
}
