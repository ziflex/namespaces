# namespaces

Angular-flavored dependency injection container.

[![npm version](https://badge.fury.io/js/namespaces-js.svg)](https://www.npmjs.com/package/namespaces-js)
[![Bower version](https://badge.fury.io/bo/namespaces-js.svg)](http://badge.fury.io/bo/namespaces-js)
[![Build Status](https://secure.travis-ci.org/ziflex/namespaces.svg?branch=master)](http://travis-ci.org/ziflex/namespaces)

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

    var Container = require('namespaces-js');

    container.value('settings', settings);
    container.namespace('services/infrastructure').service('http', require('http'));
    container.namespace('services/external/api').factory('users', ['settings', 'services/infrastructure/http'], (settings, http) => {
        return new UsersApi(settings.api, http);
    });
    container.namespace('services/business').service('users', ['services/external/api/users'], UsersService);


    var usersServiceInstance = container.resolve('services/business/users');

```

### Namespaces

#### Basic

```javascript

    var Container = require('namespaces-js');

    var container = new Container();    
    container.namespace('models').value('user', require('./models/user');
    container.namespace('services').service('user', require('./services/user');
    container.namespace('core/infrastructure').service('logger', require('logger'));

    ...

    var userService = container.resolve('services/user');
    var userInstance = container.resolve('models/user');
    var logger = container.resolve('core/infrastructure/logger');

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

### Custom resolving

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

### Namespace Helper

````javascript

    var namespaces = Container.map({
        settings: 'settings',
        services: ['core', 'domain']
    });

    var container = new Container();

    container.namespace(namespaces.settings()).const('settings', { apiEndpoint: '/' });
    container.namespace(namespaces.services.core()).service('database', require('./db-manager'));
    container.namespace(namespaces.services.domain()).service('account', require('./acount-service'));

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
Helper function that converts object / array to chain of functions.      

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
