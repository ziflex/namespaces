/* eslint-disable no-unused-expressions, func-names */
import { expect } from 'chai';
import Module from '../../src/module';

describe('Module', () => {
    describe('.getNamespace', () => {
        it('should return module namespace', () => {
            const namespace = 'foo';
            const module = new Module(namespace);

            expect(() => module.getNamespace()).to.not.throw(Error);
            expect(module.getNamespace()).to.be.equal(namespace);
        });
    });
    describe('.getName', () => {
        it('should return module name', () => {
            const namespace = 'foo';
            const name = 'bar';
            const module = new Module(namespace, name);

            expect(() => module.getName()).to.not.throw(Error);
            expect(module.getName()).to.be.equal(name);
        });
    });
    describe('.getDependencies', () => {
        it('should return module dependencies', () => {
            const namespace = 'foo';
            const name = 'bar';
            const dependencies = ['foo/qaz', 'foo/wsx'];
            const module = new Module(namespace, name, dependencies);

            expect(() => module.getDependencies()).to.not.throw(Error);
            expect(module.getDependencies()).to.be.equal(dependencies);
        });
    });
    describe('.getValue', () => {
        context('When is initialized', () => {
            it('should return value', () => {
                const values = [
                    1,
                    'string', {
                        foo: 'bar'
                    },
                    [
                        'foo', 'bar'
                    ],
                    () => {
                        return 'function';
                    }
                ];

                values.forEach((value) => {
                    const namespace = 'foo';
                    const name = 'bar';
                    const dependencies = [];
                    const module = new Module(namespace, name, dependencies, () => {
                        return () => value;
                    });

                    module.initialize();
                    expect(() => module.getValue()).to.not.throw(Error);
                    expect(module.getValue()).to.be.equal(value);
                });
            });
        });
        context('When is not initialized', () => {
            it('should throw an error', () => {
                const module = new Module('foo', 'bar', []);

                expect(() => module.getValue()).to.throw(Error);
            });
        });
    });
    describe('.isInitialized', () => {
        context('When is initialized', () => {
            it('should return "true"', () => {
                const namespace = 'foo';
                const name = 'bar';
                const dependencies = [];
                const module = new Module(namespace, name, dependencies, function init() {
                    return 1;
                });

                module.initialize();
                expect(module.isInitialized()).to.equal(true);
            });
        });
        context('When is not initialized', () => {
            it('should return "false"', () => {
                const namespace = 'foo';
                const name = 'bar';
                const dependencies = [];
                const module = new Module(namespace, name, dependencies, function init() {
                    return 1;
                });

                expect(module.isInitialized()).to.equal(false);
            });
        });
    });
    describe('initialize', () => {
        context('When is initialized', () => {
            it('should not throw an error', () => {
                const namespace = 'foo';
                const name = 'bar';
                const dependencies = [];
                const module = new Module(namespace, name, dependencies, function init() {
                    return 1;
                });

                expect(() => module.initialize()).to.not.throw(Error);
            });
        });
        context('When is not initialized', () => {
            it('should throw an error', () => {
                const namespace = 'foo';
                const name = 'bar';
                const dependencies = [];
                const module = new Module(namespace, name, dependencies, function init() {
                    return 1;
                });

                module.initialize();
                expect(() => module.initialize()).to.throw(Error);
            });
        });
    });
});

/* eslint-enable no-unused-expressions, func-names  */
