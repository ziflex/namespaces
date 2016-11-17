/* eslint-disable no-unused-expressions, func-names  */
import { expect } from 'chai';
import isString from 'is-string';
import isFunction from 'is-function';
import path from '../../src/utils/path';

describe('path', () => {
    const separator = '/';

    describe('path.join', () => {
        it('should join "foo"', () => {
            expect(path.join(separator, 'foo')).to.equal('foo');
        });

        it('should join "/, foo"', () => {
            expect(path.join(separator, '/', 'foo')).to.equal('foo');
        });

        it('should join "/, /, foo"', () => {
            expect(path.join(separator, '/', '/', 'foo')).to.equal('foo');
        });

        it('should join "foo, bar"', () => {
            expect(path.join(separator, 'foo', 'bar')).to.equal('foo/bar');
        });

        it('should join "/, foo, bar"', () => {
            expect(path.join(separator, '/', 'foo', 'bar')).to.equal('foo/bar');
        });

        it('should join "/, foo, bar, "', () => {
            expect(path.join(separator, '/', 'foo', 'bar', ' ')).to.equal('foo/bar');
        });

        it('should join "/, foo, bar, /"', () => {
            expect(path.join(separator, '/', 'foo', 'bar', '/')).to.equal('foo/bar');
        });

        it('should join "/, undefined, null, 1, [], {}"', () => {
            expect(path.join(separator, '/', undefined, null, 1, [], {})).to.equal('');
        });
    });

    describe('path.split', () => {
        it('should split "/"', () => {
            expect(path.split(separator, '/')).to.eql({ namespace: '', name: '' });
        });

        it('should split "foo"', () => {
            expect(path.split(separator, 'foo')).to.eql({ namespace: '', name: 'foo' });
        });

        it('should split "/foo"', () => {
            expect(path.split(separator, '/foo')).to.eql({ namespace: '', name: 'foo' });
        });

        it('should split "/foo/bar"', () => {
            expect(path.split(separator, '/foo/bar')).to.eql({ namespace: 'foo', name: 'bar' });
        });

        it('should split "/foo/bar/"', () => {
            expect(path.split(separator, '/foo/bar/')).to.eql({ namespace: 'foo/bar', name: '' });
        });
    });

    describe('.map', () => {
        it('should map paths', () => {
            const result = path.map({
                consts: 'consts',
                services: {
                    components: [
                        'actions',
                        'dispatcher',
                        ['helpers'],
                        { stores: ['user', { users: ['joe'] }] }
                    ],
                    domain: 'domain',
                    core: {
                        networking: 'networking',
                        database: 'database'
                    }
                }
            });

            expect(isFunction(result), '"result" must be a function').to.be.true;
            expect(result(), '"result()"').to.eql('');
            expect(result('foo'), '"result(`foo`)"').to.eql('foo');

            expect(isFunction(result.consts), '"result.consts" must be a function').to.be.true;
            expect(result.consts(), '"result.consts()"').to.eql('consts');
            expect(result.consts('foo'), '"result.consts(`foo`)"').to.eql('consts/foo');

            expect(isFunction(result.services), '"result.services" must be a function').to.be.true;
            expect(result.services(), '"result.services()"').to.eql('services');
            expect(result.services('foo'), '"result.services(`foo`)"').to.eql('services/foo');

            expect(isFunction(result.services.components), '"result.services.components" must be a function').to.be.true;
            expect(result.services.components(), '"result.services.components()"').to.eql('services/components');
            expect(result.services.components('foo'), '"result.services.components(`foo`)"').to.eql('services/components/foo');

            expect(isFunction(result.services.components.actions), '"result.services.components.actions" must be a function').to.be.true;
            expect(result.services.components.actions(), '"result.services.components.actions()"').to.eql('services/components/actions');
            expect(result.services.components.actions('foo'), '"result.services.components.actions(`foo`)"').to.eql('services/components/actions/foo');

            expect(isFunction(result.services.components.dispatcher), '"result.services.components.dispatcher" must be a function').to.be.true;
            expect(result.services.components.dispatcher(), '"result.services.components.dispatcher()"').to.eql('services/components/dispatcher');
            expect(result.services.components.dispatcher('foo'), '"result.services.components.dispatcher(`foo`)"').to.eql('services/components/dispatcher/foo');

            expect(isFunction(result.services.components.helpers), '"result.services.components.helpers" must be a function').to.be.true;
            expect(result.services.components.helpers(), '"result.services.components.helpers()"').to.eql('services/components/helpers');
            expect(result.services.components.helpers('foo'), '"result.services.components.helpers(`foo`)"').to.eql('services/components/helpers/foo');

            expect(isFunction(result.services.components.stores), '"result.services.components.stores" must be a function').to.be.true;
            expect(result.services.components.stores(), '"result.services.components.stores()"').to.eql('services/components/stores');
            expect(result.services.components.stores('foo'), '"result.services.components.stores(`foo`)"').to.eql('services/components/stores/foo');

            expect(isFunction(result.services.components.stores.user), '"result.services.components.stores.user" must be a function').to.be.true;
            expect(result.services.components.stores.user(), '"result.services.components.stores.user()"').to.eql('services/components/stores/user');
            expect(result.services.components.stores.user('foo'), '"result.services.components.stores.user(`foo`)"').to.eql('services/components/stores/user/foo');

            expect(isFunction(result.services.components.stores.users.joe), '"result.services.components.stores.users.joe" must be a function').to.be.true;
            expect(result.services.components.stores.users.joe(), '"result.services.components.stores.users.joe()"').to.eql('services/components/stores/users/joe');
            expect(result.services.components.stores.users.joe('foo'), '"result.services.components.stores.users.joe(`foo`)"').to.eql('services/components/stores/users/joe/foo');

            expect(isFunction(result.services.domain), '"result.services.domain" must be a function').to.be.true;
            expect(result.services.domain(), '"result.services.domain()"').to.eql('services/domain');
            expect(result.services.domain('foo'), '"result.services.domain(`foo`)"').to.eql('services/domain/foo');

            expect(isFunction(result.services.core)).to.be.true;
            expect(result.services.core()).to.eql('services/core');
            expect(result.services.core('foo')).to.eql('services/core/foo');

            expect(isFunction(result.services.core.networking)).to.be.true;
            expect(result.services.core.networking()).to.eql('services/core/networking');
            expect(result.services.core.networking('foo')).to.eql('services/core/networking/foo');

            expect(isFunction(result.services.core.database)).to.be.true;
            expect(result.services.core.database()).to.eql('services/core/database');
            expect(result.services.core.database('foo')).to.eql('services/core/database/foo');
        });

        it('should map array based paths', () => {
            const result = path.map([
                'foo',
                'bar',
                {
                    qaz: 'wsx'
                },
                {
                    system: [
                        'process'
                    ]
                },
                [
                    'edc'
                ]
            ]);

            expect(isFunction(result.foo), 'result.foo').to.be.true;
            expect(result.foo(), 'result.foo()').to.eql('foo');

            expect(isFunction(result.wsx), 'result.wsx').to.be.true;
            expect(result.wsx(), 'result.wsx()').to.eql('wsx');

            expect(isFunction(result.edc), 'result.edc').to.be.true;
            expect(result.edc(), 'result.edc()').to.eql('edc');

            expect(isFunction(result.system), 'result.system').to.be.true;
            expect(result.system(), 'result.system()').to.eql('system');

            expect(isFunction(result.system.process), 'result.system.process').to.be.true;
            expect(result.system.process(), 'result.system.process()').to.eql('system/process');
        });

        it('should resolve array of paths', () => {
            const result = path.map({
                core: {
                    infrastructure: [
                        'item1',
                        'item2'
                    ],
                    domain: 'foo'
                },
                system: [
                    'component1',
                    'component2'
                ]
            });

            const paths = result.system([
                'component1',
                'component2'
            ]);

            expect(isString(paths[0]), '"paths[0]" must be a string').to.be.true;
            expect(paths[0], '"path[0]"').to.eql('system/component1');

            expect(isString(paths[1]), '"paths[1]" must be a string').to.be.true;
            expect(paths[1], '"path[1]"').to.eql('system/component2');
        });
    });
});

/* eslint-enable no-unused-expressions, func-names  */
