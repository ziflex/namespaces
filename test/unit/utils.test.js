/* eslint-disable no-unused-expressions, func-names  */

import {expect} from 'chai';
import { joinPath, splitPath } from '../../src/utils';

describe('Utils', function() {
    const separator = '/';
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
});

/* eslint-enable no-unused-expressions, func-names  */
