
export const safeBoolean = (value: any) => {
    return value === undefined || (typeof value === 'function' ? value() : value);
};
export const safeCompute = (computeFunction: (() => void) | undefined | null) => {
    if (computeFunction) {
        computeFunction();
    }
};
export const sortWithOrder = (obj1: {order?: number}, obj2: {order?: number}) => {
    if (obj1 === undefined || obj1.order === undefined) {
        return -1;
    } else if (obj2 === undefined || obj2.order === undefined) {
        return 1;
    } else {
        return obj1.order - obj2.order;
    }
};
