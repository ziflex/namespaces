/* eslint-disable no-unused-expressions, func-names */
import {expect} from 'chai';
import Container from '../../src/index';

describe('Container', () => {
    let container = null;

    beforeEach(() => {
        container = new Container();
    });

    describe('registration', () => {
        context('empty container', () => {
            it('should successfully register modules', () => {
                const register = () => {
                    container.value('value', {name: 'bar'});
                    container.service('service', function Service() {
                        this.name = 'bar';
                    });
                    container.factory('factory', function Service() {
                        return {value: new Date()};
                    });
                };

                expect(register).to.not.throw();
            });

            it('should register object with predefines names', () => {
                const register = () => {
                    container.factory('toString', function toStringConverter() {
                        return () => 'foobar';
                    });
                };

                expect(register).to.not.throw();
                const toStringConverter = container.resolve('toString');

                expect(toStringConverter()).to.equal('foobar');
            });
        });

        context('not empty container', () => {
            it('should throw error when register module twice', () => {
                const register = () => {
                    container.value('value', {name: 'bar'});
                    container.value('value', {name: 'bar'});
                };

                expect(register).to.throw();
            });
        });

        describe('register twice using namespace instance', () => {
            context('same type of module', () => {
                it('should throw error', () => {
                    const register = () => {
                        container.value('foo', 'foo');
                        container.value('foo', 'bar');
                    };

                    expect(register).to.throw();
                });
            });

            context('different type of module', () => {
                it('should throw error', () => {
                    const register = () => {
                        container.value('foo', 'foo');
                        container.service('foo', function Service() {});
                    };

                    expect(register).to.throw();
                });
            });

            context('different type and name of module', () => {
                it('should not throw error', () => {
                    const register = () => {
                        container.value('foo', 'foo');
                        container.service('bar', function Service() {});
                    };

                    expect(register).to.not.throw();
                });
            });

            context('module name with separator', () => {
                it('should throw error', () => {
                    const register = () => {
                        container.value('foo/bar', 1);
                    };

                    expect(register).to.throw();
                });
            });
        });

        describe('.namespace', () => {
            it('should support chain', () => {
                let namespace = container.namespace('foo').namespace('bar');
                namespace.value('qaz', 1);
                let resolved = container.resolve('foo/bar/qaz');
                expect(resolved).to.equal(1);

                namespace = container.namespace('foo/bar').namespace('qaz');
                namespace.value('wsx', 1);
                resolved = container.resolve('foo/bar/qaz/wsx');
                expect(resolved).to.equal(1);
            });
            context('same name', () => {
                it('should register in different namespaces', () => {
                    const register = () => {
                        container.namespace('models').value('user', function User() {});
                        container.namespace('services').service('user', function UserService() {});
                    };

                    expect(register).to.not.throw();
                });

                it('should not register in same namespace', () => {
                    const register = () => {
                        container.namespace('models').value('user', function User() {});
                        container.namespace('models').service('user', function UserService() {});
                    };

                    expect(register).to.throw();
                });
            });
        });

        describe('#map', () => {
            it('should exist', () => {
                expect(() => {
                    return Container.map({
                        core: 'core'
                    });
                }).to.not.throw;
            });
        });
    });
});
/* eslint-enable no-unused-expressions, func-names */
