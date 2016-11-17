import isNil from 'is-nil';

export default function parseArgs(...args) {
    const name = args[0];
    let dependencies = args[1];
    let definition = args[2];

    if (isNil(definition)) {
        definition = dependencies;
        dependencies = null;
    }

    return { name, dependencies, definition };
}
