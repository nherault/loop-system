export var safeBoolean = function (value) {
    return value === undefined || (typeof value === 'function' ? value() : value);
};
export var safeCompute = function (computeFunction) {
    if (computeFunction) {
        computeFunction();
    }
};
export var sortWithOrder = function (obj1, obj2) {
    if (obj1 === undefined || obj1.order === undefined) {
        return -1;
    }
    else if (obj2 === undefined || obj2.order === undefined) {
        return 1;
    }
    else {
        return obj1.order - obj2.order;
    }
};
//# sourceMappingURL=../../src/src/utils/utils.js.map