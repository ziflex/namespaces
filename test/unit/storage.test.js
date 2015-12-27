/* eslint-disable no-unused-expressions */

import {expect} from 'chai';
import { isNull, isUndefined } from '../../src/utils';
import Storage from '../../src/storage';
import Module from '../../src/module';

describe('Storage', () => {
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

            expect(getItem).not.to.throw;
            const item = getItem();
            expect(isNull(item) || isUndefined(item)).to.be.not.true;
        });
    });
});

/* eslint-enable no-unused-expressions */
