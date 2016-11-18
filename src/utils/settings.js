import isString from 'is-string';
import isObject from 'is-object';

const DEFAULT_SEPARATOR = '/';
const DEFAULT_PANIC = true;

function getSeparator(value) {
    if (isString(value) && value.trim() !== '') {
        return value;
    }

    return DEFAULT_SEPARATOR;
}

function getPanic(value) {
    if (typeof value === 'boolean') {
        return value;
    }

    return DEFAULT_PANIC;
}

export default function create(params) {
    const settings = {
        separator: DEFAULT_SEPARATOR,
        panic: true
    };

    if (isString(params)) {
        settings.separator = getSeparator(params);
    } else if (isObject(params)) {
        settings.separator = getSeparator(params.separator);
        settings.panic = getPanic(params.panic);
    }

    return settings;
}
