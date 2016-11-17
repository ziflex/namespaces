function create(constructor, args) {
    function Temp() {}
    Temp.prototype = constructor.prototype;
    const instance = new Temp();
    const result = constructor.apply(instance, args);
    return Object(result) === result ? result : instance;
}

export default create;
