import isString from 'is-string';
import isObject from 'is-object';
import isArray from 'is-array';
import forEach from 'for-each';
import setIn from './set-in';

function isValidName(separator = '/', name) {
    return name.indexOf(separator) === -1;
}

function join(separator = '/', ...parts) {
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

function split(separator = '/', path) {
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
        result.namespace = join(separator, ...parts.slice(0, len - 1));
    } else {
        result.namespace = '';
    }

    result.name = parts[len - 1] || '';

    if (isString(result.name) && !result.name.trim()) {
        result.name = '';
    }

    return result;
}

function create(separator, current) {
    const currentPath = isArray(current) ? join(separator, ...current) : current;
    return function path(name) {
        if (isArray(name)) {
            return name.map(path);
        }

        return join(separator, currentPath, name);
    };
}

function traverse(node, parentPath = [], callback) {
    forEach(node, (value, keyOrIndex) => {
        if (isString(value) || typeof value === 'number') {
            callback(node, [...parentPath, value], parentPath);
            return;
        }

        let newPath = parentPath;

        if (isArray(node)) {
            if (isObject(value)) {
                traverse(value, newPath, callback);
            } else {
                traverse(value, newPath.slice().pop(), callback);
            }
        } else {
            newPath = [...parentPath, keyOrIndex];
            callback(node, newPath, parentPath);
            traverse(value, newPath, callback);
        }
    });
}

function mapPaths(target, separator = '/') {
    const result = create(separator);

    traverse(target, [], (value, path) => {
        setIn(result, path, create(separator, path));
    });

    return result;
}

export default {
    split,
    join,
    map: mapPaths,
    isValidName
};
