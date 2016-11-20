# Changelog

## 1.1.0

### Added
* Better type check for all input args.
* ``size``, ``clear`` and ``resolveAll`` can receive a Namespace instance now.

### Fixed
* Stoarge size calculation (now it tracks changes)

## 1.0.0

### Added
* ``panic`` params that prevents throwing an error on resolving not existing module.
* ``clear([namespace])`` method that allows to clear either a whole container or a given namespace.
* ``size([namespace])`` method that returns a size of either a whole container or a given namespace.

### Changed
* Dropped Bower support
* Moved to Symbols. All internals are secured.
* Code clean up.

## 0.5.5
### Changed
* Updated 'npmignore' rules in order to ignore build related files.

## 0.5.4
### Fixed
* Fixed build for IE

## 0.5.3
### Fixed
* Circular dependency check

## 0.5.2
### Added
* Circular dependency check

### Fixed
* ````Container.map```` did not handle properly array as input.

## 0.5.1

### Fixed
* Error when used names from ``Object.prototype``

## 0.5.0
### Added
* Custom resolver for modules
````js

    // global resolver
    container.service('my-service-1', () => {
        return ['dep1', 'dep2'];
    }, MyServiceClass);

    // per-dependency-resolver-with
    container.service('my-service-2', [
        'my-service-1',
        () => {
            return 'foo';
        }
    ], MyService2Class);
````
### Changed
* ```map``` functions now can resolve multiple paths   
````js
    const namespaces = map({
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

    const paths = namespaces.system([
        'component1',
        'component2'
    ]);

    // ['system/component1', 'system/component2']
````
* improved error messaging
### Fixed
* ```map``` couldn't resolve object inside array.
* Module created via ````factory```` initialized only once if the value is function.


## 0.4.2

### Added
* ```contains``` method that determines by passed path whether there is something registered.

## 0.4.1

### Fixed
* Location of namespace helper

## 0.4.0

### Added
* ```const``` method for namespace. Registers values which are resolved as they are.
* ```getName``` for namespace
* utility function ```map```

### Removed
* ```register```

## 0.3.0

New shiny API!

### Added
* Registration methods on container level for root objects.
* New chained method ```namespace```.
* Module name validation (doesn't allow to register name with separators)

## 0.2.0

### Added
* Multiple usage of module registrator

## 0.1.1

### Fixed

Fixed `npm` package.

## 0.1.0

### Added

* `value` support
* `service` support
* `factory` support
