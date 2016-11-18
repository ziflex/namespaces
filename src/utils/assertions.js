import isNil from 'is-nil';

/**
 * Checks for a condition; if the condition is false,
 * follows the escalation policy set for the analyzer.
 * @param {boolean} condition - The condition to check.
 * @param {string} message - A message to display if the condition is not met..
 * @throws {Error} If condition is false.
 */
export function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

/**
 * Specifies a precondition contract for the enclosing method or property,
 * and displays a message if the condition for the contract fails.
 * @param {any} value - The conditional expression to test.
 * @param {string} name - The method / property name to display if the condition is false.
 * @throws {Error} If value is nil.
 */
export function requires(value, name = 'argument') {
    assert(!isNil(value), `${name} is required!`);
}
