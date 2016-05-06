import {
  isArray,
  isString,
  isNumber,
  forEach,
  map,
  joinPath,
  isObject,
  setIn
} from './utils';

function create(separator, current) {
    const currentPath = isArray(current) ? joinPath(separator, ...current) : current;
    return function path(name) {
        if (isArray(name)) {
            return map(name, path);
        }

        return joinPath(separator, currentPath, name);
    };
}

function traverse(node, parentPath = [], callback) {
    forEach(node, (value, keyOrIndex) => {
        if (isString(value) || isNumber(value)) {
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

export default function createPathMap(target, separator = '/') {
    const result = create(separator);

    traverse(target, [], (value, path) => {
        setIn(result, path, create(separator, path));
    });

    return result;
}
