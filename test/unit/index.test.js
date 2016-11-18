/* eslint-disable global-require, no-unused-expressions */
import { expect } from 'chai';

describe('Index', () => {
    it('should be exported as commonjs module', () => {
        const Container = require('../../src/index');

        expect(Container).to.not.be.null;
    });
});
