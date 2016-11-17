/* eslint-disable no-restricted-syntax, no-param-reassign */
import forEach from 'for-each';
import isArray from 'is-array';

export function reduce(collection, iteratee, initialValue, context = this) {
    let result = initialValue;

    forEach(collection, (v, k) => {
        result = iteratee.call(this, result || v, v, k);
    }, context);

    return result;
}

function setIn(target, path, value) {
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

export default setIn;
