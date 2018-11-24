export interface ComputeElement {
    id?: string;
    computeFn: ComputeFct;
    isToCompute?: IsComputeFct;
    enable?: boolean;
    order?: number;
    pipeline?: Pipeline;
    [propName: string]: any;
}
export declare type ComputeFct = (delta: number, extraArgs?: any) => void;
export declare type IsComputeFct = (computeElement: ComputeElement, delta: number) => boolean;
export interface LoopOptionsParams {
    step?: number;
    maxDt?: number;
    speed?: number;
    hooks?: Hooks;
    renderWithTime?: boolean;
}
export interface LoopOptions {
    step: number;
    maxDt: number;
    speed: number;
    hooks: Hooks;
    renderWithTime: boolean;
}
export declare enum Pipeline {
    PRE = "pre",
    POST = "post"
}
export interface Hooks {
    preProcess?: (() => void) | null | undefined;
    postProcess?: (() => void) | null | undefined;
    preUpdate?: (() => void) | null | undefined;
    postUpdate?: (() => void) | null | undefined;
    preUpdateStep?: (() => void) | null | undefined;
    postUpdateStep?: (() => void) | null | undefined;
    preRender?: (() => void) | null | undefined;
    postRender?: (() => void) | null | undefined;
}
export declare enum ComputeTypes {
    RENDERS = "renders",
    UPDATES = "updates"
}
export interface LoopSystem {
    start(options?: LoopOptionsParams): LoopSystem;
    startSimulation(refreshRate: number, options?: LoopOptionsParams): LoopSystem;
    stopSimulation(): LoopSystem;
    stop(): LoopSystem;
    setCurrentOptions(options: LoopOptionsParams): LoopSystem;
    addAfterFrameTask(task: () => void): LoopSystem;
    getOptions(): LoopOptions;
    getCurrentOptions(): LoopOptions;
    addCompute(computeType: ComputeTypes, compute: ((delta: number, extraArgs?: any) => void) | ComputeElement): LoopSystem;
    removeComputes(computeType: ComputeTypes, id?: string | string[]): LoopSystem;
    setEnableComputes(computeType: ComputeTypes, enable: boolean, id?: string | string[]): LoopSystem;
    removeAll(): LoopSystem;
}
