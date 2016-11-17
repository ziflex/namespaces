/* eslint-disable no-unused-expressions, func-names, prefer-arrow-callback   */
import { expect } from 'chai';
import { isNull, isUndefined } from '../../src/utils';
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
            it('should throw error when module path is missed', () => {
                expect(() => {
                    storage.getItem();
                }).to.throw();
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

        context('when module name is not passed', () => {
            it('should throw an error', () => {
                expect(() => {
                    storage.contains();
                }).to.throw(Error);
            });
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
            expect(isNull(item) || isUndefined(item)).to.be.not.true;
        });
    });
});

/* eslint-enable no-unused-expressions, func-names  */
