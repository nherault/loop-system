"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compute once
 * @param delta
 * @param computeElement
 */
exports.computeOnce = function (computeElement) {
    var isToCompute = false;
    if (computeElement.isAllreadyRendered === undefined || !computeElement.isAllreadyRendered) {
        computeElement.isAllreadyRendered = true;
        isToCompute = true;
    }
    return isToCompute;
};
/**
 * Compute using a time interval set on the "computeElement" object
 * @param delta
 * @param computeElement
 */
exports.computeTimeInterval = function (computeElement, delta) {
    var isToCompute = false;
    computeElement.currTime = computeElement.currTime === undefined
        ? computeElement.computeTimeInterval : computeElement.currTime;
    computeElement.currTime -= delta;
    if (computeElement.currTime < 0) {
        computeElement.currTime = computeElement.computeTimeInterval;
        isToCompute = true;
    }
    return isToCompute;
};
//# sourceMappingURL=../../src/src/loop/loop-is-compute-fct.js.map