# namespaces
> Universal registry with dependencies

Angular-flavored DI container.

[![npm version](https://badge.fury.io/js/namespaces-js.svg)](https://www.npmjs.com/package/namespaces-js)
[![Build Status](https://secure.travis-ci.org/ziflex/namespaces.svg?branch=master)](http://travis-ci.org/ziflex/namespaces)
[![Coverage Status](https://coveralls.io/repos/github/ziflex/namespaces-js/badge.svg?branch=master)](https://coveralls.io/github/ziflex/namespaces-js)

## Install

via npm

```sh

    $ npm install --save namespaces-js

```

## Usage

### Basic

```javascript

    var Container = require('namespaces-js');
    var container = new Container();

    container.factory('a', () => 'a');
    container.factory('b', ['a'] (a) => a + 'b');

    const b = container.resolve('b'); // -> 'ab'
    const a = container.resolve('a'); // -> 'a'

```

### Namespaces

```javascript

    var Container = require('namespaces-js');
    var container = new Container();

    container.namespace('a').value('foo', 'bar');
    container.namespace('b').service('foo', function Bar() { this.name = 'bar'; });
    container.namespace('c/d').factory('foo', () => 'bar');    

    const aFoo = container.resolve('a/foo'); // -> 'bar'
    const bFoo = container.resolve('b/foo'); // -> instance of Bar
    const cdFoo = container.resolve('c/d/foo'); // -> 'bar'

```

Also, you can define custom namespace separator:

```javascript

    var Container = require('namespaces-js');
    var container = new Container('.');

    container.namespace('a.b.c').value('foo', 'bar');
    container.namespace('d.e.f').service('foo', function Bar() { this.name = 'bar'; });

```

#### Modular

```javascript

    var Container = require('namespaces-js');    
    var container = new Container();   

    var ui = container.namespace('ui');
    var actions = ui.namespace('actions');
    actions.service('user', require('./ui/flux/actions/user'));
    actions.service('users', require('./ui/flux/actions/users'));

    var stores = ui.namespace('stores');
    stores.service('users', ['ui/actions/users', 'ui/actions/user'], require('./ui/flux/stores/users'));

```

### Resolving
#### Basic

````javascript

    var Container = require('namespaces-js');
    var container = new Container();

    container.value('foo', 'bar');

    const foo = container.resolve('foo'); // -> 'bar'

````

#### Group

````javascript

    var Container = require('namespaces-js');
    var container = new Container();

    var services = container.namespace('services');
    services.service('users', UsersService);
    services.service('accounts', AccountsService);

    var actions = container.namespace('ui/actions');
    actions.service('user', ['services/users', 'services/accounts'], UserActions);
    actions.service('users', ['services/users'], UsersActions);

    var allActions = container.resolveAll('ui/actions');

````

#### Custom

````javascript

    var Container = require('namespaces-js');
    var container = new Container();

    container.factory('a', () => 'a');
    container.factory('b', [
        'a',
        function customResolver() {
            return { foo: 'bar' };
        }
    ], (a, c) => [a, c]);

````


### Namespace Helper

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

#### Multiple paths   
````js
    const namespaces = Container.map({
        core: {
            infrastructure: [
                'item1',
                'item2'
            ],
            domain: 'foo'
        },
        system: [
            'component1',
            'component2'
        ]
    });

    const paths = result.system([
        'component1',
        'component2'
    ]);

    // ['system/component1', 'system/component2']
````

## API

### new Container([namespaceSeparator: string = '/'])

Creates new container.
Arguments: namespaces separator. Optional. Default '/'.

### container.namespace([namespaceName: string]): Namespace
Returns or creates new namespace.    

### container.resolve(modulePath: string): any
Returns registered module's value.   

### container.resolveAll(namespace: string): Map<string, any>
Returns all values from registered modules in particular namespace.      

### namespace.const(name: string, value: number | string | array | object | function): void
Registers a value, such as a string, a number, an array, an object or a function.    

### namespace.value(name: string, [dependencies: string[]], value: number | string | array | object | function): void
Registers a value, such as a string, a number, an array, an object or a constructor.    
Note: If passed value is function type, it will be treated as constructor and every time when it's injected, new instance will be created.

### namespace.service(name: string, [dependencies: string[]], value: function): void
Registers a service constructor, which will be invoked with `new` to create the service instance.    
Any type which was registered as a service is singleton.

### namespace.factory(name: string, [dependencies: string[]], value: function): void
Register a service factory, which will be called to return the service instance.    
Any function's value will be registered as a singleton.

### namespace.getName(): string      
Returns name of current namespace.   

### Container.map     
Helper function that converts object / array to chain of functions in order to easily use namespace paths.      

### License

The MIT License (MIT)    
Copyright (C) 2015 Tim Voronov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
