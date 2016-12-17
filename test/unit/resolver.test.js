/* eslint-disable no-unused-expressions, func-names  */

import { expect } from 'chai';
import Container from '../../src/index';
import Resolver from '../../src/resolver';
import Storage from '../../src/storage';

describe('Resolver', () => {
    let container = null;

    beforeEach(() => {
        container = new Container();
    });

    describe('#constructor', () => {
        context('When storage is not passed', () => {
            it('should throw an error', () => {
                expect(() => new Resolver()).to.throw(Error);
            });
        });
    });

    describe('.resolve', () => {
        context('When path is not passed or is not a string', () => {
            it('should throw an error', () => {
                const resolver = new Resolver(new Storage('/', false));
                expect(() => {
                    resolver.resolve();
                }).to.throw(Error);

                expect(() => {
                    resolver.resolve(1);
                }).to.throw(Error);
            });
        });

        context('When container is empty and panic="true"', () => {
            it('should throw an error', () => {
                const resolve = () => {
                    container.resolve('foo');
                };

                expect(resolve).to.throw();
            });
        });

        context('custom resolver', () => {
            it('should return array of dependencies', (done) => {
                container.factory('my-service', () => {
                    return [
                        'foo',
                        'bar'
                    ];
                }, (arg1, arg2) => {
                    expect(arg1, 'arg1 exists').to.exist;
                    expect(arg2, 'arg1 exists').to.exist;
                    expect(arg1, 'arg1 equals to "foo"').to.equal('foo');
                    expect(arg2, 'arg2 equals to "bar"').to.equal('bar');
                    done();
                });

                container.resolve('my-service');
            });

            it('should return object as single dependency', (done) => {
                container.factory('my-service', () => {
                    return { foo: 'bar' };
                }, (arg1, arg2) => {
                    expect(arg1, 'arg1 exists').to.exist;
                    expect(arg2, 'arg1 exists').to.not.exist;
                    expect(arg1, 'arg1 equals to "{ foo: \'bar\' }"').to.eql({ foo: 'bar' });
                    done();
                });

                container.resolve('my-service');
            });

            it('should return single value for dependency', (done) => {
                container.const('my-val', 'value');
                container.factory('my-service', [
                    'my-val',
                    () => {
                        return { foo: 'bar' };
                    }
                ], (arg1, arg2) => {
                    expect(arg1, 'arg1 exists').to.exist;
                    expect(arg2, 'arg1 exists').to.exist;
                    expect(arg1, 'arg2 equals to "value"').to.equal('value');
                    expect(arg2, 'arg2 equals to "{ foo: \'bar\' }"').to.eql({ foo: 'bar' });
                    done();
                });

                container.factory('my-service2', [
                    'my-val',
                    () => {
                        return [{ foo: 'bar' }, { qaz: 'wsx' }];
                    }
                ], (arg1, arg2) => {
                    expect(arg1, 'arg1 exists').to.exist;
                    expect(arg2, 'arg1 exists').to.exist;
                    expect(arg1, 'arg2 equals to "value"').to.equal('value');
                    expect(arg2, 'arg2 equals to "[{ foo: \'bar\' }, { qaz: \'wsx\'}]"').to.eql([{ foo: 'bar' }, { qaz: 'wsx' }]);
                });

                container.resolve('my-service');
                container.resolve('my-service2');
            });
        });

        describe('#const', () => {
            context('plain types', () => {
                it('should successfully resolve function', () => {
                    const module = function foo() { return 'bar'; };
                    container.const('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                    expect(found).to.eql(found2);
                    expect(found() === 'bar').to.be.true;
                });

                it('should successfully resolve object', () => {
                    const module = { name: 'bar' };
                    container.const('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve number', () => {
                    const module = 10;
                    container.const('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve string', () => {
                    const module = 'foo';
                    container.const('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve array', () => {
                    const module = [1, 2, 3];
                    container.const('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });
            });
        });

        describe('#value', () => {
            context('plain types', () => {
                it('should successfully resolve object', () => {
                    const module = { name: 'bar' };
                    container.value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve number', () => {
                    const module = 10;
                    container.value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve string', () => {
                    const module = 'foo';
                    container.value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve array', () => {
                    const module = [1, 2, 3];
                    container.value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });
            });
            context('constructor', () => {
                context('without dependencies', () => {
                    it('should successfully resolved', () => {
                        let index = 0;
                        container.value('value', function User() {
                            index += 1;
                            this.name = `foo_${index}`;
                            this.surname = `bar_${index}`;
                        });

                        const found = container.resolve('value');
                        const found2 = container.resolve('value');
                        expect(found).to.exist;
                        expect(found2).to.exist;
                        expect(found).to.not.equal(found2);
                        expect(found.name).to.exist;
                        expect(found.surname).to.exist;
                    });
                });
                context('with dependencies', () => {
                    it('should successfully resolved', () => {
                        let index = 0;
                        container.value('group', function Group() {
                            this.accounts = [];
                        });
                        container.value('user', ['group'], function User(group) {
                            index += 1;
                            this.name = `foo_${index}`;
                            this.surname = `bar_${index}`;
                            this.group = group;
                        });

                        const found = container.resolve('user');
                        expect(found).to.exist;
                        expect(found.group).to.exist;
                        expect(found.group.accounts).to.exist;
                    });
                });
            });
        });

        describe('#service', () => {
            context('without dependencies', () => {
                it('should resolve single service', () => {
                    container.service('http', function HttpService() {
                        this.get = () => {};
                        this.post = () => {};
                    });

                    const found = container.resolve('http');
                    const found2 = container.resolve('http');

                    expect(found).to.exist;
                    expect(found).to.equal(found2);
                });
            });
            context('with dependencies', () => {
                it('should resolve single service', () => {
                    container.value('http-transport', function HttpTransport() {});

                    container.service('settings', function Settings() {});

                    container.service('http', ['http-transport', 'settings'], function HttpService(transport, settings) {
                        this.settings = settings;
                        this.transport = transport;
                        this.get = () => {};
                        this.post = () => {};
                    });

                    const found = container.resolve('http');
                    const found2 = container.resolve('http');

                    expect(found).to.exist;
                    expect(found).to.equal(found2);
                    expect(found.settings).to.exist;
                    expect(found.transport).to.exist;
                });
            });
        });

        describe('#factory', () => {
            context('without dependencies', () => {
                it('should resolve single service', () => {
                    container.factory('http', function HttpServiceFactory() {
                        return new function HttpService() {
                            this.get = () => {};
                            this.post = () => {};
                        };
                    });

                    const found = container.resolve('http');
                    const found2 = container.resolve('http');

                    expect(found).to.exist;
                    expect(found).to.equal(found2);
                });
            });
            context('with dependencies', () => {
                it('should resolve single service', () => {
                    container.value('http-transport', function HttpTransport() {});

                    container.service('settings', function Settings() {});

                    container.factory('http', ['http-transport', 'settings'], function HttpServiceFactory(transport, settings) {
                        return new function HttpService() {
                            this.settings = settings;
                            this.transport = transport;
                            this.get = () => {};
                            this.post = () => {};
                        };
                    });

                    const found = container.resolve('http');
                    const found2 = container.resolve('http');

                    expect(found).to.exist;
                    expect(found).to.equal(found2);
                    expect(found.settings).to.exist;
                    expect(found.transport).to.exist;
                });
            });
        });

        describe('in namespace', () => {
            describe('#value', () => {
                context('same name', () => {
                    it('should resolve from different namespaces', () => {
                        container.value('value', 1);
                        container.namespace('consts').value('value', 2);

                        expect(container.resolve('value')).to.equal(1);
                        expect(container.resolve('consts/value')).to.equal(2);
                    });
                });

                context('as dependency', () => {
                    it('should resolve', () => {
                        container.namespace('consts').value('value', 1);
                        container.namespace('models').value('user', ['consts/value'], function User(value) {
                            this.value = value;
                        });

                        const user = container.resolve('models/user');
                        expect(user).to.exist;
                        expect(user.value).to.equal(1);
                    });
                });
            });
            describe('#factory', () => {
                context('same name', () => {
                    it('should resolve from different namespaces', () => {
                        container.factory('service', function factoryA() {
                            return {name: 'A'};
                        });
                        container.namespace('services').factory('service', function factoryB() {
                            return {name: 'B'};
                        });

                        const serviceA = container.resolve('service');
                        const serviceB = container.resolve('services/service');
                        expect(serviceA).to.exist;
                        expect(serviceB).to.exist;
                        expect(serviceA).to.not.equal(serviceB);
                    });
                });
                context('as dependency', () => {
                    it('should resolve', () => {
                        container.namespace('services/api').factory('service', function factoryA() {
                            return {name: 'A'};
                        });
                        container.namespace('services').factory('service', ['services/api/service'], function factoryB(serviceA) {
                            return {name: 'B', api: serviceA};
                        });

                        const serviceB = container.resolve('services/service');
                        const serviceA = container.resolve('services/api/service');
                        expect(serviceA).to.exist;
                        expect(serviceB).to.exist;
                        expect(serviceB.api).to.equal(serviceA);
                    });
                });
            });
            describe('#service', () => {
                context('same name', () => {
                    it('should resolve from different namespaces', () => {
                        container.service('service', function ServiceA() {
                        });
                        container.namespace('services').service('service', function ServiceB() {
                        });

                        const serviceA = container.resolve('service');
                        const serviceB = container.resolve('services/service');
                        expect(serviceA).to.exist;
                        expect(serviceB).to.exist;
                        expect(serviceA).to.not.equal(serviceB);
                    });
                });
                context('as dependency', () => {
                    it('should resolve', () => {
                        container.namespace('services/api').service('service', function ServiceA() {});
                        container.namespace('services').service('service', ['services/api/service'], function ServiceB(serviceA) {
                            this.api = serviceA;
                        });

                        const serviceB = container.resolve('services/service');
                        const serviceA = container.resolve('services/api/service');
                        expect(serviceA).to.exist;
                        expect(serviceB).to.exist;
                        expect(serviceB.api).to.equal(serviceA);
                    });
                });
            });
        });

        describe('circular dependency', () => {
            it('should throw during resolving', () => {
                const self = () => {
                    const c = new Container();
                    c.value('value1', ['value1'], 1);
                    expect(c.resolve('value1')).to.exist;
                };
                const shallow = () => {
                    const c = new Container();
                    c.value('value1', ['value2'], 1);
                    c.value('value2', ['value1'], 2);
                    expect(c.resolve('value1')).to.exist;
                    expect(c.resolve('value2')).to.exist;
                };
                const deep = () => {
                    const c = new Container();
                    c.value('a', ['b', 'd'], 'a');
                    c.value('b', ['c', 'e'], 'b');
                    c.value('c', ['e', 'd'], 'c');
                    c.value('d', ['b'], 'd');
                    c.value('e', 'e');
                    expect(c.resolve('a')).to.exist;
                };

                const deep2 = () => {
                    const c = new Container();
                    c.value('a', ['b', 'd'], 'a');
                    c.value('b', ['c', 'e'], 'b');
                    c.value('c', ['e', 'd'], 'c');
                    c.value('d', ['a'], 'd');
                    c.value('e', 'e');
                    expect(c.resolve('a')).to.exist;
                };

                expect(self).to.throw(ReferenceError);
                expect(shallow).to.throw(ReferenceError);
                expect(deep).to.throw(ReferenceError);
                expect(deep2).to.throw(ReferenceError);
            });

            it('should not throw an error', () => {
                container.namespace('core/system/api').factory('application', [
                    'core/infrastructure/logger',
                    'core/system/renderer'
                ], () => 'application');
                container.namespace('core/infrastructure').factory('logger', () => {
                    return 'logger';
                });
                container.namespace('core/system').factory('renderer', [
                    'core/settings',
                    'core/infrastructure/logger'
                ], () => 'renderer');
                container.namespace('core').const('settings', {});

                const resolve = () => container.resolve('core/system/api/application');

                expect(resolve).to.not.throw(Error);
                expect(resolve).to.not.throw(ReferenceError);
            });
        });
    });
    describe('.resolveAll', () => {
        context('When path is not passed or is not a string', () => {
            it('should throw an error', () => {
                const resolver = new Resolver(new Storage('/', false));
                expect(() => {
                    resolver.resolveAll();
                }).to.throw(Error);

                expect(() => {
                    resolver.resolveAll(1);
                }).to.throw(Error);
            });
        });

        context('empty container', () => {
            it('should throw error', () => {
                expect(() => {
                    container.resolveAll('foo');
                }).to.throw(Error);
            });
        });

        context('not empty container', () => {
            it('should resolve all modules from particular namespace', () => {
                const foo = container.namespace('foo');
                foo.service('A', function() { this.name = 'A'; });
                foo.service('B', ['foo/A'], function() { this.name = 'B'; });
                foo.service('C', ['foo/B'], function() { this.name = 'C'; });
                foo.service('D', ['foo/B', 'foo/C'], function() { this.name = 'D'; });

                const bar = container.namespace('bar');
                bar.service('E', ['foo/A'], function() { this.name = 'E'; });
                bar.service('F', ['bar/E', 'foo/C'], function() { this.name = 'F'; });

                const resolved = container.resolveAll('bar');
                const arr = [];

                for (const name in resolved) {
                    if (resolved.hasOwnProperty(name)) {
                        arr.push({
                            name,
                            value: resolved[name]
                        });
                    }
                }

                expect(arr.length).to.equal(2);
            });
        });

        context('When "nested=true"', () => {
            it('should resolve values from nested namespaces', () => {
                const foo = container.namespace('foo');
                foo.service('A', function() { this.name = 'A'; });
                foo.service('B', ['foo/A'], function() { this.name = 'B'; });
                foo.service('C', ['foo/B'], function() { this.name = 'C'; });
                foo.service('D', ['foo/B', 'foo/C'], function() { this.name = 'D'; });

                const bar = foo.namespace('bar');
                bar.service('E', ['foo/A'], function() { this.name = 'E'; });
                bar.service('F', ['foo/bar/E', 'foo/C'], function() { this.name = 'F'; });

                const resolved = container.resolveAll('foo', true);
                const arr = [];

                for (const name in resolved) {
                    if (resolved.hasOwnProperty(name)) {
                        arr.push({
                            name,
                            value: resolved[name][0]
                        });
                    }
                }

                expect(arr.length).to.equal(6);
            });

            it('should resolve values from nested namespaces and avoid collisions', () => {
                const foo = container.namespace('foo');
                foo.service('A', function() { this.name = 'A'; });
                foo.service('B', ['foo/A'], function() { this.name = 'B'; });
                foo.service('C', ['foo/B'], function() { this.name = 'C'; });
                foo.service('D', ['foo/B', 'foo/C'], function() { this.name = 'D'; });

                const bar = foo.namespace('bar');
                bar.service('E', ['foo/A'], function() { this.name = 'E'; });
                bar.service('F', ['foo/bar/E', 'foo/C'], function() { this.name = 'F'; });

                const qaz = bar.namespace('qaz');
                qaz.service('G', ['foo/A'], function() { this.name = 'E'; });
                qaz.service('F', ['foo/bar/E', 'foo/C'], function() { this.name = 'F'; });

                const resolved = container.resolveAll('foo', true);
                const arr = [];

                for (const name in resolved) {
                    if (resolved.hasOwnProperty(name)) {
                        resolved[name].forEach((i) => {
                            arr.push(i)
                        });
                    }
                }

                expect(arr.length).to.equal(8);
            });
        });
    });
});

/* eslint-enable no-unused-expressions, func-names  */
