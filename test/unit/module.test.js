/* eslint-disable no-unused-expressions, func-names */

import {expect} from 'chai';
import {isFunction} from '../../src/utils';
import Module from '../../src/module';

describe('Module', function() {
    describe('.getNamespace', function() {
        it('should return module namespace', function() {
            const namespace = 'foo';
            const module = new Module(namespace);

            expect(module.getNamespace).to.not.throw;
            expect(module.getNamespace()).to.be.equal(namespace);
        });
    });
    describe('.getName', function() {
        it('should return module name', function() {
            const namespace = 'foo';
            const name = 'bar';
            const module = new Module(namespace, name);

            expect(module.getName).to.not.throw;
            expect(module.getName()).to.be.equal(name);
        });
    });
    describe('.getDependencies', function() {
        it('should return module dependencies', function() {
            const namespace = 'foo';
            const name = 'bar';
            const dependencies = ['foo/qaz', 'foo/wsx'];
            const module = new Module(namespace, name, dependencies);

            expect(module.getDependencies).to.not.throw;
            expect(module.getDependencies()).to.be.equal(dependencies);
        });
    });
    describe('.getValue', function() {
        context('when is initialized', function() {
            it('should return value', function() {
                const values = [
                    1,
                    'string',
                    {foo: 'bar'},
                    ['foo', 'bar'],
                    function() {
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
                    expect(module.getValue).to.not.throw;
                    expect(module.getValue()).to.be.equal(value);
                });
            });
        });
        context('when is not initialized', function() {
            it('should throw an error', function() {
                const module = new Module('foo', 'bar', []);

                expect(module.getValue).to.throw;
            });
        });
    });
    describe('.isInitialized', function() {
        context('when is initialized', function() {
            it('should return "true"', function() {
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
        context('when is not initialized', function() {
            it('should return "false"', function() {
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
    describe('initialize', function() {
        context('when is initialized', function() {
            it('should not throw an error', function() {
                const namespace = 'foo';
                const name = 'bar';
                const dependencies = [];
                const module = new Module(namespace, name, dependencies, function init() {
                    return 1;
                });

                expect(module.initialize).to.not.throw;
            });
        });
        context('when is not initialized', function() {
            it('should throw an error', function() {
                const namespace = 'foo';
                const name = 'bar';
                const dependencies = [];
                const module = new Module(namespace, name, dependencies, function init() {
                    return 1;
                });

                module.initialize();
                expect(module.initialize).to.throw;
            });
        });
    });
});

/* eslint-enable no-unused-expressions, func-names  */
