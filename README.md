# namespaces

Angular-flavored dependency injection container. 

[![npm version](https://badge.fury.io/js/namespaces.svg)](https://www.npmjs.com/package/namespaces-js)
[![Bower version](https://badge.fury.io/bo/namespaces.svg)](http://badge.fury.io/bo/namespaces-js)
[![Build Status](https://secure.travis-ci.org/ziflex/namespaces.svg?branch=master)](http://travis-ci.org/ziflex/namespaces)
[![Dependency Status](https://david-dm.org/ziflex/namespaces.svg)](https://david-dm.org/ziflex/namespaces)

## Install

via npm

```sh

    $ npm install --save namespaces-js

```
via bower

```sh

    $ bower install --save namespaces-js

```

## Usage

### Basic

```javascript

    var DI = require('namespaces-js');
    
    var container = new DI();
    container.register().value('name', 'foobar');
    container.register().factory('foo-service', function() {
        var FooService = require('./services/foo-service');
        return new FooService();
    });
    container.register().service('bar-service', ['foo-service', 'name'], require('./services/bar-service'));

    ...
    
    var bar = container.resolve('bar-service');
    var foo = container.resolve('foo-service');
  
```

### Different namespaces

```javascript

    var DI = require('namespaces-js');
    
    var container = new DI();
    container.register('models').value('user', require('./models/user');
    container.register('services').service('user', require('./services/user');

    ...
    
    var userService = container.resolve('services/user');
    var userInstance = container.resolve('models/user');
  
```

## API

### new Namespace([namespaceSeparator: string = '/'])

Creates new container.
Arguments: namespaces separator. Optional. Default '/'.

### container.register([namespaceName: string]): Module
Creates new module in root namespace.
If `namespaceName` is passed, will be created in particular namespace.

### container.resolve(modulePath: string): any
Returns registered module's value.

### Module.value(name: string, [dependencies: string[]], value: number | string | array | object | function): void
Registers a value, such as a string, a number, an array, an object or a constructor.
Note: If passed value is function type, it will be treated as constructor and every time when it's injected, new instance will be created.

### Module.service(name: string, [dependencies: string[]], value: function): void
Registers a service constructor, which will be invoked with `new` to create the service instance.
Any type which was registered as a service is singleton.

### Module.factory(name: string, [dependencies: string[]], value: function): void
Register a service factory, which will be called to return the service instance.
Any function's value will be registered as a singleton.