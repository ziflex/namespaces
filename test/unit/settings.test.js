/* eslint-disable no-unused-expressions, func-names  */
import { expect } from 'chai';
import settings from '../../src/utils/settings';

const DEFAULT_SETTINGS = {
    separator: '/',
    panic: true
};

describe('Utils. Settings', () => {
    context('When value is not passed', () => {
        it('should return default settings', () => {
            const res = settings();

            expect(res).to.eql(DEFAULT_SETTINGS);
        });
    });

    context('When values is a string', () => {
        it('should return settings with a set separator', () => {
            const res = settings('.');

            expect(res).to.eql({ separator: '.', panic: DEFAULT_SETTINGS.panic });
        });

        context('When string is empty', () => {
            it('should return settings with a set separator', () => {
                const res = settings(' ');

                expect(res).to.eql(DEFAULT_SETTINGS);
            });
        });
    });

    context('When value is an object', () => {
        it('should return an overriden values', () => {
            let res = settings({ separator: '.', panic: false });

            expect(res).to.eql({ separator: '.', panic: false });

            res = settings({ panic: false });

            expect(res).to.eql({ separator: DEFAULT_SETTINGS.separator, panic: false });
        });

        context('When values are invalid', () => {
            it('should return default values', () => {
                let res = settings({ separator: '.', panic: 1 });

                expect(res).to.eql({ separator: '.', panic: true });

                res = settings({ separator: true });

                expect(res).to.eql(DEFAULT_SETTINGS);
            });
        });
    });
});
