import { safeBoolean, safeCompute, sortWithOrder } from '../utils/utils';
import {
    ComputeElement,
    ComputeFct,
    ComputeTypes,
    LoopOptions,
    LoopOptionsParams,
    LoopSystem,
    Pipeline } from './loop-system.types';

const defaultOptions: LoopOptions = {
    hooks: {},
    maxDt: 0.25, // in seconds
    renderWithTime: false,
    speed: 1.0,
    step: 1 / 60, // in seconds
};

const DEFAULT_REFRESH_RATE = 1 / 60;

export class LoopSystemDefault implements LoopSystem {

    private dt: number;
    private last: number;

    private renders: ComputeElement[];
    private updates: ComputeElement[];

    private requestAnimationFrameId: number;
    private isSimulationRunning: boolean;

    private options: LoopOptions;
    private currentOptions: LoopOptions;

    private afterFrameTasks: Array<() => void>;

    constructor() {
        this.dt = 0;
        this.requestAnimationFrameId = 0;
        this.last = window.performance.now();
        this.renders = [];
        this.updates = [];

        this.options = defaultOptions;
        this.currentOptions = defaultOptions;
        this.isSimulationRunning = true;
        this.afterFrameTasks = [];
    }

    public start(options?: LoopOptionsParams): LoopSystem {
        if (options) {
            this.setOptions(options);
            this.setCurrentOptions(options);
        }
        this.requestAnimationFrameId = requestAnimationFrame(() => this.nextRequestAnimationFrame());
        return this;
    }

    public stop(): LoopSystem {
        window.cancelAnimationFrame(this.requestAnimationFrameId);
        return this;
    }

    public startSimulation(refreshRate = DEFAULT_REFRESH_RATE, options?: LoopOptionsParams): LoopSystem {
        if (options) {
            this.setOptions(options);
            this.setCurrentOptions(options);
        }
        this.isSimulationRunning = true;
        while (this.isSimulationRunning) {
            this.frame(refreshRate);
        }
        return this;
    }

    public stopSimulation(): LoopSystem {
        this.isSimulationRunning = false;
        return this;
    }

    public setCurrentOptions(options: LoopOptionsParams): LoopSystem {
        options.speed = options.speed !== undefined ? Math.max(0, options.speed) : this.currentOptions.speed;
        this.afterFrameTasks.push(() => {
            this.currentOptions = {
                ...this.currentOptions,
                ...options,
            };
        });
        return this;
    }

    public addAfterFrameTask(task: () => void): LoopSystem {
        this.afterFrameTasks.push(task);
        return this;
    }

    public getOptions(): LoopOptions {
        return {
            ...this.options,
        };
    }

    public getCurrentOptions(): LoopOptions {
        return {
            ...this.currentOptions,
        };
    }

    public addCompute(name: ComputeTypes, compute: ComputeFct | ComputeElement): LoopSystem {
        this[name].push(compute instanceof Function ? { computeFn: compute } : compute);
        return this;
    }

    public removeComputes(name: ComputeTypes, id?: string | string[]): LoopSystem {
        if (id !== undefined) {
            const ids = Array.isArray(id) ? id : [id];
            ids.forEach((currId: string) => {
                const computeIndex = this[name].findIndex((compute: ComputeElement) => compute.id === currId);
                if (computeIndex !== -1) {
                    this[name].splice(computeIndex, 1);
                }
            });
        } else {
            this[name] = [];
        }
        return this;
    }

    public setEnableComputes(name: ComputeTypes, enable: boolean, id?: string | string[]): LoopSystem {
        if (id !== undefined) {
            const ids = Array.isArray(id) ? id : [id];
            ids.forEach((currId: string) => {
                const computeIndex = this[name].findIndex((compute: ComputeElement) => compute.id === currId);
                if (computeIndex !== -1) {
                    this[name][computeIndex].enable = enable;
                }
            });
        } else {
            this[name].forEach((compute: ComputeElement) => compute.enable = enable);
        }
        return this;
    }

    public removeAll(): LoopSystem {
        this.removeComputes(ComputeTypes.RENDERS);
        return this.removeComputes(ComputeTypes.UPDATES);
    }

    ///////////////////////////////
    // PRIVATE METHODS
    ///////////////////////////////

    private setOptions(options: LoopOptionsParams): void {
        this.options = {
            ...this.options,
            ...options,
        };
        this.options.speed = Math.max(0, this.options.speed);
    }

    private nextRequestAnimationFrame(): void {
        const now = window.performance.now();
        this.frame(now);
        this.requestAnimationFrameId = requestAnimationFrame(() => this.nextRequestAnimationFrame());
    }

    private frame(now: number): void {
        safeCompute(this.currentOptions.hooks.preProcess);

        safeCompute(this.currentOptions.hooks.preUpdate);
        this.compute(ComputeTypes.UPDATES, this.currentOptions.step, Pipeline.PRE);
        this.updateWithSteps(now);
        this.compute(ComputeTypes.UPDATES, this.currentOptions.step, Pipeline.POST);
        safeCompute(this.currentOptions.hooks.postUpdate);

        safeCompute(this.currentOptions.hooks.preRender);
        const stepTimeForRender = this.currentOptions.renderWithTime ? this.currentOptions.step : 0;
        this.compute(ComputeTypes.RENDERS, stepTimeForRender, Pipeline.PRE);
        this.compute(ComputeTypes.RENDERS, stepTimeForRender);
        this.compute(ComputeTypes.RENDERS, stepTimeForRender, Pipeline.POST);
        safeCompute(this.currentOptions.hooks.postRender);

        safeCompute(this.currentOptions.hooks.postProcess);

        this.manageAfterFrame();
    }

    private manageAfterFrame(): void {
        this.afterFrameTasks.forEach((afterFrameTask: () => void) => {
            afterFrameTask();
        });
        this.afterFrameTasks = [];
    }

    private updateWithSteps(now: number): void {
        this.dt += this.currentOptions.speed * Math.min(this.currentOptions.maxDt, (now - this.last) / 1000);
        while (this.dt > this.currentOptions.step) {
            this.dt -= this.currentOptions.step;

            safeCompute(this.currentOptions.hooks.preUpdateStep);
            this.compute(ComputeTypes.UPDATES, this.currentOptions.step);
            safeCompute(this.currentOptions.hooks.postUpdateStep);
        }
        this.last = now;
    }

    private compute(name: ComputeTypes, delta: number, pipeline?: Pipeline): void {
        this[name]
            .filter((computeEl: ComputeElement) => pipeline === computeEl.pipeline)
            .sort(sortWithOrder)
            .forEach((computeEl: ComputeElement) => {
                if (safeBoolean(computeEl.enable)
                    && (computeEl.isToCompute === undefined || computeEl.isToCompute(computeEl, delta))) {
                    computeEl.computeFn(delta, computeEl);
                }
            });
    }
}
