/* eslint-disable no-unused-expressions, func-names, prefer-arrow-callback  */
import { expect } from 'chai';
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
                    container.value('value', { name: 'bar' });
                    container.service('service', function Service() {
                        this.name = 'bar';
                    });
                    container.factory('factory', function Service() {
                        return { value: new Date() };
                    });
                };

                expect(register).to.not.throw(Error);
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
                    container.value('value', { name: 'bar' });
                    container.value('value', { name: 'bar' });
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

        describe('.service', () => {
            context('When constructor not passed', () => {
                it('should throw an error', () => {
                    expect(() => {
                        container.service('foo');
                    }).to.throw(Error);

                    expect(() => {
                        container.service('foo', []);
                    }).to.throw(Error);

                    expect(() => {
                        container.namespace('foo').service('bar');
                    }).to.throw(Error);

                    expect(() => {
                        container.namespace('foo').service('bar', []);
                    }).to.throw(Error);
                });
            });

            context('When constructor is not a function', () => {
                it('should throw an error', () => {
                    expect(() => {
                        container.service('foo', [], 1);
                    }).to.throw(Error);

                    expect(() => {
                        container.namespace('foo').service('bar', [], []);
                    }).to.throw(Error);
                });
            });
        });

        describe('.factory', () => {
            context('When factory not passed', () => {
                it('should throw an error', () => {
                    expect(() => {
                        container.factory('foo');
                    }).to.throw(Error);

                    expect(() => {
                        container.factory('foo', []);
                    }).to.throw(Error);

                    expect(() => {
                        container.namespace('foo').factory('bar');
                    }).to.throw(Error);

                    expect(() => {
                        container.namespace('foo').factory('bar', []);
                    }).to.throw(Error);
                });
            });

            context('When constructor is not a function', () => {
                it('should throw an error', () => {
                    expect(() => {
                        container.factory('foo', [], 1);
                    }).to.throw(Error);

                    expect(() => {
                        container.namespace('foo').factory('bar', [], []);
                    }).to.throw(Error);
                });
            });
        });

        describe('.contains', () => {
            context('When module exists', () => {
                it('should return "true"', () => {
                    container.const('foo', 'bar');
                    container.namespace('foo').const('bar', 'qaz');

                    expect(container.contains('foo')).to.be.true;
                    expect(container.contains('foo/bar')).to.be.true;
                });
            });

            context('When module does not exist', () => {
                it('should return "false"', () => {
                    container.const('foo', 'bar');

                    expect(container.contains('foo')).to.be.true;
                    expect(container.contains('bar')).to.be.false;
                    expect(container.contains('foo/bar')).to.be.false;
                });
            });
        });

        describe('.getName', () => {
            it('should return a namespace name', () => {
                expect(container.getName()).to.eql('');

                expect(container.namespace('foo').getName()).to.eql('foo');
                expect(container.namespace('foo').namespace('bar').getName()).to.eql('foo/bar');
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

        describe('.resolve', () => {
            context('When panic="false"', () => {
                it('should return a null when module does not exist', () => {
                    container = new Container({ panic: false });

                    expect(container.resolve('foo')).to.be.null;
                });

                it('should return a null when namespace does not exist', () => {
                    container = new Container({ panic: false });
                    container.namespace('foo').const('bar', 'qaz');

                    expect(container.resolve('wsx/bar')).to.be.null;
                });
            });
        });

        describe('.clear', () => {
            it('should clear container', () => {
                expect(container.size()).to.eql(0);

                container.const('foo', 'bar');
                container.namespace('foo').const('bar', 'qaz');
                container.namespace('foo').namespace('bar').const('qaz', 'wsx');

                expect(container.size()).to.eql(3);

                container.clear();

                expect(container.size()).to.eql(0);
            });

            it('should clear a given namespace', () => {
                expect(container.size()).to.eql(0);

                container.const('foo', 'bar');
                container.namespace('foo').const('bar', 'qaz');
                container.namespace('foo').namespace('bar').const('qaz', 'wsx');

                expect(container.size()).to.eql(3);

                container.clear();

                expect(container.size()).to.eql(0);
            });
        });

        describe('#map', () => {
            it('should exist', () => {
                expect(() => {
                    return Container.map({
                        core: 'core'
                    });
                }).to.not.throw(Error);
            });
        });
    });
});
/* eslint-enable no-unused-expressions, func-names */
