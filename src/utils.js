/* eslint-disable no-restricted-syntax, no-param-reassign */
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

export function isNumber(value) {
    return value !== null && !isNaN(value) && typeof value === 'number';
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
            if (iteratee.call(context, collection[i], i) === false) {
                break;
            }
        }
    } else if (isObject(collection)) {
        for (const prop in collection) {
            if (collection.hasOwnProperty(prop)) {
                if (iteratee.call(context, collection[prop], prop) === false) {
                    break;
                }
            }
        }
    }
}

export function find(collection, iteratee) {
    let result = null;

    if (!isFunction(iteratee)) {
        return result;
    }

    forEach(collection, (v, k) => {
        if (iteratee(v, k) === true) {
            result = v;
            return false;
        }

        return true;
    });

    return result;
}

export function filter(collection, iteratee) {
    const result = [];

    if (!isFunction(iteratee)) {
        return result;
    }

    forEach(collection, (v, k) => {
        if (iteratee(v, k) === true) {
            result.push(v);
        }
    });

    return result;
}

export function map(collection, iteratee, context = this) {
    const result = [];

    forEach(collection, (v, k) => {
        result.push(iteratee.call(context, v, k));
    });

    return result;
}

export function reduce(collection, iteratee, initialValue, context = this) {
    let result = initialValue;

    forEach(collection, (v, k) => {
        result = iteratee.call(this, result || v, v, k);
    }, context);

    return result;
}

export function setIn(target, path, value) {
    if (!isArray(path)) {
        return target;
    }

    const result = target || {};
    const endIndex = path.length - 1;
    reduce(path, (obj, pathPart, index) => {
        let prop = obj;

        if (index === endIndex) {
            prop[pathPart] = value;
        } else {
            prop = obj[pathPart];

            if (!prop) {
                prop = {};
                obj[pathPart] = prop;
            }
        }

        return prop;
    }, result);

    return result;
}

export function getIn(target, path) {
    let result = null;

    if (!isArray(path)) {
        return result;
    }


    const endIndex = path.length - 1;
    let prop = target;

    forEach(path, (pathPart, index) => {
        if (endIndex === index) {
            result = prop[pathPart];
            return false;
        }

        prop = prop[pathPart];

        if (!prop) {
            return false;
        }

        return true;
    });

    return result;
}

export function hasIn(target, path) {
    return getIn(target, path) !== null;
}
