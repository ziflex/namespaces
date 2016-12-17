/* eslint-disable no-unused-expressions, func-names, prefer-arrow-callback   */
import { expect } from 'chai';
import isNil from 'is-nil';
import Storage from '../../src/storage';
import Module from '../../src/module';

describe('Storage', function () {
    let storage = null;

    beforeEach(() => {
        storage = new Storage('/');
    });

    describe('.addItem', () => {
        context('invalid parameters', () => {
            it('should throw error when module is not passed', () => {
                expect(() => {
                    storage.addItem();
                }).to.throw();
            });

            it('should throw error when module is not instance of Module class', () => {
                const values = [
                    new Date(),
                    {},
                    [],
                    1,
                    'foo'
                ];

                values.forEach((value) => {
                    expect(() => {
                        storage.addItem(value);
                    }).to.throw();
                });
            });

            it('should throw error when namespace name is not string', () => {
                const values = [
                    new Date(),
                    {},
                    [],
                    1,
                    null,
                    undefined
                ];

                values.forEach((value) => {
                    expect(() => {
                        storage.addItem(new Module(value));
                    }).to.throw();
                });
            });

            it('should throw error when module name is missed', () => {
                expect(() => {
                    storage.addItem(new Module('/'));
                }).to.throw();
            });

            it('should throw error when module name is not string', () => {
                const values = [
                    new Date(),
                    {},
                    [],
                    1,
                    null,
                    undefined
                ];

                values.forEach((value) => {
                    expect(() => {
                        storage.addItem(new Module('/', value));
                    }).to.throw();
                });
            });

            it('should throw error when module already exists', () => {
                expect(() => {
                    storage.addItem(new Module('/', 'foo', [], function init() {}));
                    storage.addItem(new Module('/', 'foo', [], function init() {}));
                }).to.throw();
            });
        });

        context('valid parameters', () => {
            it('should add new module', () => {
                expect(() => {
                    storage.addItem(new Module('/', 'foo', [], function init() {}));
                }).to.not.throw();
            });
        });
    });

    describe('.getItem', () => {
        context('invalid parameters', () => {
            it('should throw error when module path is missed or is not a string', () => {
                expect(() => {
                    storage.getItem();
                }).to.throw(Error);

                expect(() => {
                    storage.getItem(1);
                }).to.throw(Error);

                expect(() => {
                    storage.getItem([]);
                }).to.throw(Error);
            });

            it('should throw error when module path is not string', () => {
                const values = [
                    new Date(),
                    {},
                    [],
                    1,
                    null,
                    undefined
                ];

                values.forEach((value) => {
                    expect(() => {
                        storage.getItem(value);
                    }).to.throw();
                });
            });

            it('should throw error when namespace does not exist', () => {
                storage.addItem(new Module('foo', 'bar', [], function init() {}));

                expect(() => {
                    storage.getItem('qaz/bar');
                }).to.throw();
            });

            it('should throw error when module does not exist', () => {
                storage.addItem(new Module('foo', 'bar', [], function init() {}));

                expect(() => {
                    storage.getItem('foo/qaz');
                }).to.throw();
            });
        });

        context('valid parameters', () => {
            it('should return item', () => {
                storage.addItem(new Module('foo', 'bar', [], function init() {}));

                expect(storage.getItem('foo/bar')).to.exist;
            });
        });

        context('When panic="true"', () => {
            it('should throw an error when module does not exist', () => {
                storage = storage = new Storage('/', true);
                storage.addItem(new Module('foo', 'bar', [], function init() {}));

                expect(() => {
                    storage.getItem('foo/qaz');
                }).to.throw(Error);
            });
        });

        context('When panic="false"', () => {
            it('should return null when namespace does not exist', () => {
                storage = storage = new Storage('/', false);
                storage.addItem(new Module('foo', 'bar', [], function init() {}));

                expect(storage.getItem('bar/qaz')).to.be.null;
            });

            it('should return null when module does not exist', () => {
                storage = storage = new Storage('/', false);
                storage.addItem(new Module('foo', 'bar', [], function init() {}));

                expect(storage.getItem('foo/qaz')).to.be.null;
            });
        });
    });

    describe('.contains', () => {
        context('when module is registered', () => {
            it('should return "true"', () => {
                storage.addItem(new Module('foo', 'bar', [], function init() {}));

                expect(storage.contains('foo/bar')).to.be.true;
            });
        });

        context('when module is not registered', () => {
            it('should return "false"', () => {
                expect(storage.contains('foo/bar')).to.be.false;

                storage.addItem(new Module('foo', 'bar', [], function init() {}));

                expect(storage.contains('qaz/bar')).to.be.false;
            });
        });

        context('when module name is not passed or is not a string', () => {
            it('should throw an error', () => {
                expect(() => {
                    storage.contains();
                }).to.throw(Error);

                expect(() => {
                    storage.contains(1);
                }).to.throw(Error);
            });
        });
    });

    describe('.size', () => {
        context('When namespace is not passed', () => {
            it('should return size of whole storage', () => {
                expect(storage.size()).to.eql(0);

                storage.addItem(new Module('', 'bar', [], function init() {}));

                expect(storage.size()).to.eql(1);

                storage.addItem(new Module('foo', 'bar', [], function init() {}));

                expect(storage.size()).to.eql(2);

                storage.addItem(new Module('foo/bar', 'bar', [], function init() {}));

                expect(storage.size()).to.eql(3);

                storage.addItem(new Module('foo/bar', 'qaz', [], function init() {}));

                expect(storage.size()).to.eql(4);
            });
        });

        context('When namespace is passed', () => {
            it('should return size of namespace', () => {
                expect(storage.size('foo')).to.eql(0);

                storage.addItem(new Module('foo', 'bar', [], function init() {}));

                expect(storage.size('foo')).to.eql(1);

                storage.addItem(new Module('foo/bar', 'bar', [], function init() {}));

                expect(storage.size('foo')).to.eql(1);

                storage.addItem(new Module('foo', 'qaz', [], function init() {}));

                expect(storage.size('foo')).to.eql(2);
            });
        });
    });

    describe('.clear', () => {
        context('When namespace is not a string', () => {
            it('should throw an error', () => {
                storage = new Storage('/', false);

                expect(() => {
                    storage.clear(1);
                }).to.throw(Error);

                expect(() => {
                    storage.clear([]);
                }).to.throw(Error);
            });
        });
        context('When namespace is not passed', () => {
            it('should clear whole storage', () => {
                storage = new Storage('/', false);

                expect(storage.size()).to.eql(0);

                storage.addItem(new Module('', 'bar', [], function init() {}));
                storage.addItem(new Module('foo', 'bar', [], function init() {}));
                storage.addItem(new Module('foo/qaz', 'bar', [], function init() {}));
                storage.addItem(new Module('foo/qaz/wsx', 'bar', [], function init() {}));

                expect(storage.size()).to.eql(4);

                storage.clear();

                expect(storage.size()).to.eql(0);

                expect(storage.getItem('bar')).to.be.null;
                expect(storage.getItem('foo/bar')).to.be.null;
                expect(storage.getItem('foo/qaz/bar')).to.be.null;
                expect(storage.getItem('foo/qaz/wsx/bar')).to.be.null;
            });
        });

        context('When namespace is passed', () => {
            it('should clear a namespace', () => {
                storage = new Storage('/', false);

                expect(storage.size()).to.eql(0);
                expect(storage.size('foo')).to.eql(0);

                storage.addItem(new Module('', 'bar', [], function init() {}));
                storage.addItem(new Module('foo', 'bar', [], function init() {}));
                storage.addItem(new Module('foo', 'qaz', [], function init() {}));
                storage.addItem(new Module('foo/qaz', 'bar', [], function init() {}));
                storage.addItem(new Module('foo/qaz/wsx', 'bar', [], function init() {}));

                expect(storage.size('foo')).to.eql(2);
                expect(storage.size()).to.eql(5);

                storage.clear('foo');

                expect(storage.size('foo')).to.eql(0);
                expect(storage.size()).to.eql(3);

                expect(storage.getItem('bar')).to.not.be.null;
                expect(storage.getItem('foo/bar')).to.be.null;
                expect(storage.getItem('foo/qaz')).to.be.null;
                expect(storage.getItem('foo/qaz/bar')).to.not.be.null;
                expect(storage.getItem('foo/qaz/wsx/bar')).to.not.be.null;
            });
        });
    });

    describe('.namespaces', () => {
        it('should return an array of containing namespaces', () => {
            storage = new Storage('/', false);

            expect(storage.namespaces()).to.be.empty;

            storage.addItem(new Module('foo', 'qaz', [], function init() {}));
            storage.addItem(new Module('foo/qaz', 'bar', [], function init() {}));
            storage.addItem(new Module('foo/qaz/wsx', 'bar', [], function init() {}));


            const namespaces = storage.namespaces();
            expect(namespaces.length).to.eql(3);

            expect(namespaces[0]).to.eql('foo');
            expect(namespaces[1]).to.eql('foo/qaz');
            expect(namespaces[2]).to.eql('foo/qaz/wsx');
        });

        it('should return an array of containing nested namespaces', () => {
            storage = new Storage('/', false);

            expect(storage.namespaces()).to.be.empty;

            storage.addItem(new Module('foo', 'qaz', [], function init() {}));
            storage.addItem(new Module('foo/qaz', 'bar', [], function init() {}));
            storage.addItem(new Module('foo/qaz/wsx', 'bar', [], function init() {}));


            const namespaces = storage.namespaces('foo/qaz');
            expect(namespaces.length).to.eql(1);

            expect(namespaces[0]).to.eql('foo/qaz/wsx');
        });
    });

    describe('.forEachIn', () => {
        context('When namespace not passed or not a string', () => {
            it('should throw an error', () => {
                expect(() => {
                    storage.addItem(new Module('foo', 'bar'));
                    storage.forEachIn(null, () => {});
                }).to.throw(Error);

                expect(() => {
                    storage.addItem(new Module('foo', 'qaz'));
                    storage.forEachIn(1, () => {});
                }, 'namespace is not a string').to.throw(Error);
            });
        });

        context('When callback not passed', () => {
            it('should throw an error ', () => {
                expect(() => {
                    storage.addItem(new Module('foo', 'bar'));
                    storage.forEachIn('foo');
                }).to.throw(Error);
            });
        });

        context('valid parameters', () => {
            it('should iterate over modules inside target namespace', () => {
                const fooModules = [
                    new Module('foo', 'qaz'),
                    new Module('foo', 'wsx'),
                    new Module('foo', 'rfv')
                ];

                const barModules = [
                    new Module('bar', 'tgb'),
                    new Module('bar', 'yhn')
                ];

                fooModules.forEach(module => storage.addItem(module));
                barModules.forEach(module => storage.addItem(module));

                const found = [];
                storage.forEachIn('foo', module => found.push(module));
                expect(found).to.eql(fooModules);
            });

            it('should pass module path during iteration', () => {
                const fooModules = [
                    new Module('foo', 'qaz'),
                    new Module('foo', 'wsx'),
                    new Module('foo', 'rfv')
                ];

                const barModules = [
                    new Module('bar', 'tgb'),
                    new Module('bar', 'yhn')
                ];

                fooModules.forEach(module => storage.addItem(module));
                barModules.forEach(module => storage.addItem(module));

                const found = [];

                storage.forEachIn('foo', (module, path) => found.push(path));
                expect(found).to.eql([
                    'foo/qaz',
                    'foo/wsx',
                    'foo/rfv'
                ]);
            });
        });

        context('When panic="true"', () => {
            it('should throw an error when namespace not found', () => {
                expect(() => {
                    storage.forEachIn('foo', () => {});
                }).to.throw(Error);
            });
        });

        context('When panic="false"', () => {
            it('should not throw an error when namespace not found', () => {
                storage = new Storage('/', false);

                expect(() => {
                    storage.forEachIn('foo', () => {});
                }).to.not.throw(Error);
            });
        });
    });

    it('should support different separators', () => {
        const separators = [
            '/',
            '.',
            '-',
            '@'
        ];

        separators.forEach((separator) => {
            const s = new Storage(separator);
            s.addItem(new Module('foo', 'bar'));
            const getItem = function getItem() {
                return s.getItem(`foo${separator}bar`);
            };

            expect(getItem).not.to.throw(Error);
            const item = getItem();
            expect(isNil(item)).to.be.not.true;
        });
    });
});

/* eslint-enable no-unused-expressions, func-names  */
