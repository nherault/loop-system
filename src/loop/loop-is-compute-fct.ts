import { ComputeElement, IsComputeFct } from './loop-system.types';

/**
 * Compute once
 * @param delta
 * @param computeElement
 */
export const computeOnce: IsComputeFct = (computeElement: ComputeElement) => {
    let isToCompute = false;
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
export const computeTimeInterval: IsComputeFct = (computeElement: ComputeElement, delta: number): boolean => {
    let isToCompute = false;
    computeElement.currTime = computeElement.currTime === undefined
        ? computeElement.computeTimeInterval : computeElement.currTime;
    computeElement.currTime -= delta;
    if (computeElement.currTime < 0) {
        computeElement.currTime = computeElement.computeTimeInterval;
        isToCompute = true;
    }
    return isToCompute;
};
