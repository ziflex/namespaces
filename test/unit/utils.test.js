/* eslint-disable no-unused-expressions, func-names  */
import { expect } from 'chai';
import setIn from '../../src/utils/set-in';

describe('Utils. Set in', () => {
    it('should set value with short path', () => {
        const path = ['foo'];
        const result = setIn({}, path, 'bar');

        expect(result, 'result').to.exist;
        expect(result.foo, 'result.foo').to.eql('bar');
    });

    it('should set value with long path', () => {
        const path = ['foo', 'bar', 'qaz'];
        const result = setIn({}, path, 'rfv');

        expect(result, 'result').to.exist;
        expect(result.foo, 'result.foo').to.exist;
        expect(result.foo.bar, 'result.foo.bar').to.exist;
        expect(result.foo.bar.qaz, 'result.foo.bar.qaz').to.exist;
        expect(result.foo.bar.qaz, 'result.foo.bar.qaz').to.eql('rfv');
    });
});

/* eslint-enable no-unused-expressions, func-names  */
