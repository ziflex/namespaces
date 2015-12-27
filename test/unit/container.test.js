/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import Container from '../../src/index';

describe('.Container', () => {
    let container = null;

    beforeEach(() => {
        container = new Container();
    });

    describe('.register', () => {
        context('empty container', () => {
            it('should successfully register modules', () => {
                const register = () => {
                    container.register().value('value', {name: 'bar'});
                    container.register().service('service', function Service() {
                        this.name = 'bar';
                    });
                    container.register().factory('factory', function Service() {
                        return {value: new Date()};
                    });
                };

                expect(register).to.not.throw();
            });
        });

        context('not empty container', () => {
            it('should throw error when register module twice', () => {
                const register = () => {
                    container.register().value('value', {name: 'bar'});
                    container.register().value('value', {name: 'bar'});
                };

                expect(register).to.throw();
            });
        });

        describe('register twice using namespace instance', () => {
            context('same type of module', () => {
                it('should throw error', () => {
                    const register = () => {
                        const namespace = container.register();
                        namespace.value('foo', 'foo');
                        namespace.value('foo', 'bar');
                    };

                    expect(register).to.throw();
                });
            });

            context('different type of module', () => {
                it('should throw error', () => {
                    const register = () => {
                        const namespace = container.register();
                        namespace.value('foo', 'foo');
                        namespace.service('foo', function Service() {});
                    };

                    expect(register).to.throw();
                });
            });

            context('different type and name of module', () => {
                it('should not throw error', () => {
                    const register = () => {
                        const namespace = container.register();
                        namespace.value('foo', 'foo');
                        namespace.service('bar', function Service() {});
                    };

                    expect(register).to.not.throw();
                });
            });
        });

        describe('namespace', () => {
            context('same name', () => {
                it('should register in different namespaces', () => {
                    const register = () => {
                        container.register('models').value('user', function User() {});
                        container.register('services').service('user', function UserService() {});
                    };

                    expect(register).to.not.throw();
                });

                it('should not register in same namespace', () => {
                    const register = () => {
                        container.register('models').value('user', function User() {});

                        container.register('models').service('user', function UserService() {});
                    };

                    expect(register).to.throw();
                });
            });
        });
    });

    describe('#resolve', () => {
        context('empty container', () => {
            it('should throw error', () => {
                const resolve = () => {
                    container.resolve('foo');
                };

                expect(resolve).to.throw();
            });
        });

        describe('#value', () => {
            context('plain types', () => {
                it('should successfully resolve object', () => {
                    const module = { name: 'bar' };
                    container.register().value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve number', () => {
                    const module = 10;
                    container.register().value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve string', () => {
                    const module = 'foo';
                    container.register().value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve array', () => {
                    const module = [1, 2, 3];
                    container.register().value('value', module);
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
                        container.register().value('value', function User() {
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
                        container.register().value('group', function Group() {
                            this.accounts = [];
                        });
                        container.register().value('user', ['group'], function User(group) {
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
                    container.register().service('http', function HttpService() {
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
                    container.register().value('http-transport', function HttpTransport() {});

                    container.register().service('settings', function Settings() {});

                    container.register().service('http', ['http-transport', 'settings'], function HttpService(transport, settings) {
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
                    container.register().factory('http', function HttpServiceFactory() {
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
                    container.register().value('http-transport', function HttpTransport() {});

                    container.register().service('settings', function Settings() {});

                    container.register().factory('http', ['http-transport', 'settings'], function HttpServiceFactory(transport, settings) {
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
                        container.register().value('value', 1);
                        container.register('consts').value('value', 2);

                        expect(container.resolve('value')).to.equal(1);
                        expect(container.resolve('consts/value')).to.equal(2);
                    });
                });

                context('as dependency', () => {
                    it('should resolve', () => {
                        container.register('consts').value('value', 1);
                        container.register('models').value('user', ['consts/value'], function User(value) {
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
                        container.register().factory('service', function factoryA() {
                            return {name: 'A'};
                        });
                        container.register('services').factory('service', function factoryB() {
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
                        container.register('services/api').factory('service', function factoryA() {
                            return {name: 'A'};
                        });
                        container.register('services').factory('service', ['services/api/service'], function factoryB(serviceA) {
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
                        container.register().service('service', function ServiceA() {
                        });
                        container.register('services').service('service', function ServiceB() {
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
                        container.register('services/api').service('service', function ServiceA() {
                        });
                        container.register('services').service('service', ['services/api/service'], function ServiceB(serviceA) {
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

        // describe('circular dependency', () => {
        //    it('should throw during resolving', () => {
        //        const self = () => {
        //            container.register().value('value1', ['value1'], 1);
        //            container.resolve('value1');
        //        };
        //        const shallow = () => {
        //            container.register().value('value1', ['value2'], 1);
        //            container.register().value('value2', ['value1'], 2);
        //            container.resolve('value1');
        //            container.resolve('value2');
        //        };
        //        const deep = () => {
        //            container.register().value('a', ['b', 'd'], 'a');
        //            container.register().value('b', ['c', 'e'], 'b');
        //            container.register().value('c', ['e', 'd'], 'c');
        //            container.register().value('d', ['b'], 'd');
        //            container.register().value('e', 'e');
        //
        //            container.resolve('a');
        //        };
        //
        //        expect(self).to.throw(ReferenceError);
        //        expect(shallow).to.throw(ReferenceError);
        //        expect(deep).to.throw(ReferenceError);
        //    });
        // });
    });
});
/* eslint-enable no-unused-expressions */
