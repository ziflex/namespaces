/* eslint-disable no-unused-expressions, func-names  */

import { expect } from 'chai';
import sinon from 'sinon';
import {
    isFunction,
    joinPath,
    splitPath,
    forEach
} from '../../src/utils';

describe('Utils', function() {
    const separator = '/';

    describe('isFunction', () => {
        it('should return true when "Function" is passed', () => {
            expect(isFunction(function() {})).to.be.true;
        });

        it('should return false when "String" is passed', () => {
            expect(isFunction('')).to.be.false;
        });

        it('should return false when "Number" is passed', () => {
            expect(isFunction(1)).to.be.false;
        });

        it('should return false when "Object" is passed', () => {
            expect(isFunction({})).to.be.false;
        });

        it('should return false when "Array" is passed', () => {
            expect(isFunction([])).to.be.false;
        });

        it('should return false when "null" is passed', () => {
            expect(isFunction(null)).to.be.false;
        });

        it('should return false when "undefined" is passed', () => {
            expect(isFunction(undefined)).to.be.false;
        });

        it('should return false when "NaN" is passed', () => {
            expect(isFunction(NaN)).to.be.false;
        });
    });

    describe('joinPath', () => {
        it('should join "foo"', () => {
            expect(joinPath(separator, 'foo')).to.equal('foo');
        });

        it('should join "/, foo"', () => {
            expect(joinPath(separator, '/', 'foo')).to.equal('foo');
        });

        it('should join "/, /, foo"', () => {
            expect(joinPath(separator, '/', '/', 'foo')).to.equal('foo');
        });

        it('should join "foo, bar"', () => {
            expect(joinPath(separator, 'foo', 'bar')).to.equal('foo/bar');
        });

        it('should join "/, foo, bar"', () => {
            expect(joinPath(separator, '/', 'foo', 'bar')).to.equal('foo/bar');
        });

        it('should join "/, foo, bar, "', () => {
            expect(joinPath(separator, '/', 'foo', 'bar', ' ')).to.equal('foo/bar');
        });

        it('should join "/, foo, bar, /"', () => {
            expect(joinPath(separator, '/', 'foo', 'bar', '/')).to.equal('foo/bar');
        });

        it('should join "/, undefined, null, 1, [], {}"', () => {
            expect(joinPath(separator, '/', undefined, null, 1, [], {})).to.equal('');
        });
    });

    describe('splitPath', () => {
        it('should split "/"', () => {
            expect(splitPath(separator, '/')).to.eql({ namespace: '', name: '' });
        });

        it('should split "foo"', () => {
            expect(splitPath(separator, 'foo')).to.eql({ namespace: '', name: 'foo' });
        });

        it('should split "/foo"', () => {
            expect(splitPath(separator, '/foo')).to.eql({ namespace: '', name: 'foo' });
        });

        it('should split "/foo/bar"', () => {
            expect(splitPath(separator, '/foo/bar')).to.eql({ namespace: 'foo', name: 'bar' });
        });

        it('should split "/foo/bar/"', () => {
            expect(splitPath(separator, '/foo/bar/')).to.eql({ namespace: 'foo/bar', name: '' });
        });
    });

    describe('forEach', () => {
        it('should iterate over an object', () => {
            const key = 'foo';
            const value = 'bar';

            const obj = {
                [key]: value
            };

            forEach(obj, (v, k) => {
                expect(v).to.eql(value);
                expect(k).to.eql(key);
            });

            const spy = sinon.spy();

            const obj2 = {
                'foo': 1,
                'bar': 2,
                'quz': 3
            };

            forEach(obj2, spy);

            expect(spy.callCount).to.equal(3);
        });

        it('should iterate over an array', () => {
            const value = 'bar';

            const arr = ['bar'];

            forEach(arr, (v, i) => {
                expect(v).to.eql(value);
                expect(i).to.eql(0);
            });

            const spy = sinon.spy();

            const arr2 = [
                1,
                2,
                3
            ];

            forEach(arr2, spy);

            expect(spy.callCount).to.equal(3);
        });
    });
});

/* eslint-enable no-unused-expressions, func-names  */
