# namespaces
> Universal registry

Angular-flavored DI container.

[![npm version](https://badge.fury.io/js/namespaces-js.svg)](https://www.npmjs.com/package/namespaces-js)
[![Build Status](https://secure.travis-ci.org/ziflex/namespaces.svg?branch=master)](http://travis-ci.org/ziflex/namespaces)
[![Coverage Status](https://coveralls.io/repos/github/ziflex/namespaces-js/badge.svg?branch=master)](https://coveralls.io/github/ziflex/namespaces-js)

## API
You can find API [here](http://ziflex.github.io/namespaces)

## Install

```sh

    $ npm install --save namespaces-js

```

## Motivation

We all love testable and modular code. In most cases it means that every piece of you system
depends on other pieces and these dependencies should be injected if we want to make our system testable and flexible. But wiring everything up might be a very tedious task with creating multiple instances, passing them into others and then, once requirements or designed changed, finding, replacing, updating and etc...
So, that's why ``namespaces`` package was created - to solve this issue. It allows you organize your system parts and easily define their dependencies by creating an application container with namespaces.

Its design is inspired by Angular v1 DI, therefore most of the concept might be familiar for those of you who are familiar with Angular v1, but some are new.

## Usage

### Just as a container

#### Stores values

```javascript

var Container = require('namespaces-js');
var container = new Container();

container.const('foo', 'bar');

const foo = container.resolve('foo');

console.log(foo); // -> 'bar'

```

#### Creates singletons

```javascript

var Container = require('namespaces-js');
var container = new Container();

container.factory('foo', () => {
    return { do: => 'bar' };
});

const foo1 = container.resolve('foo');
const foo2 = container.resolve('foo');

console.log(foo1 === foo2); // -> true

```

### As a container with dependencies

#### By module name

```javascript

var Container = require('namespaces-js');
var container = new Container();

container.factory('foo', () => 'bar');
container.factory('qaz', ['foo'], (foo) => `${foo}-fighter`);

const qaz = container.resolve('qaz');

console.log(qaz); // 'bar-fighter';

```

#### By custom resolver

```javascript

var Container = require('namespaces-js');
var container = new Container();

container.factory('foo', () => 'bar');
container.factory('qaz', [
    'foo',
    function customResolver() {
        return 'wsx';
    }
], (foo, something) => {
    return `${foo}-${something}`;
});

const qaz = container.resolve('qaz');

console.log(qaz); // 'bar-wsx';

```

### Container with namespaces

```javascript

    var Container = require('namespaces-js');
    var container = new Container();

    container.value('foo', 'bar');;
    container.namespace('my-namespace').value('foo', 'qaz');

    const foo = container.resolve('foo');
    const foo2 = container.resolve('my-namespace/foo');

    console.log(foo === foo2); // false


    container.namespace('my-namespace').namespace('sub-namespace').factory('foobar', [
        'foo',
        'my-namespace/foo'
    ], (foo, foo2) => {
        return `${foo} !== ${foo2}`;
    });

    const foobar = container.resolve('my-namespace/sub-namespace/foobar');

    console.log(foobar); // 'bar !== qaz';

```

### Namespace Helper

It comes with a handy utility function that converts a given namespace tree into function tree.
Each function-node of the tree recieves a module name and returns a full path of it.

````javascript

    var namespaces = Container.map({
        a: 'b',
        c: ['d', 'e', { f: ['g', 'h'] }]
    });

    var container = new Container();

    container.namespace(namespaces.a()).value('foo', 'bar');
    container.namespace(namespaces.b()).factory('foo', () => 'bar');
    container.namespace(namespaces.c()).factory('foo', () => 'bar');
    container.namespace(namespaces.c.f.g()).value('foo', 'bar');

    container.resolve(namespaces.a('foo'));
    container.resolve(namespaces.c.f.g('foo'));

````     
