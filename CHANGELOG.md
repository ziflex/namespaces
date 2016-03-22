# Changelog

## 0.4.3
### Fixed
* ```map``` couldn't resolve object inside array.
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

    const paths = result.system([
        'component1',
        'component2'
    ]);

    // ['system/component1', 'system/component2']
````
* improved error messaging


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
