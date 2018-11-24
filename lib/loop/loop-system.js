"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils/utils");
var loop_system_types_1 = require("./loop-system.types");
var defaultOptions = {
    hooks: {},
    maxDt: 0.25,
    renderWithTime: false,
    speed: 1.0,
    step: 1 / 60,
};
var DEFAULT_REFRESH_RATE = 1 / 60;
var LoopSystemDefault = /** @class */ (function () {
    function LoopSystemDefault() {
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
    LoopSystemDefault.prototype.start = function (options) {
        var _this = this;
        if (options) {
            this.setOptions(options);
            this.setCurrentOptions(options);
        }
        this.requestAnimationFrameId = requestAnimationFrame(function () { return _this.nextRequestAnimationFrame(); });
        return this;
    };
    LoopSystemDefault.prototype.stop = function () {
        window.cancelAnimationFrame(this.requestAnimationFrameId);
        return this;
    };
    LoopSystemDefault.prototype.startSimulation = function (refreshRate, options) {
        if (refreshRate === void 0) { refreshRate = DEFAULT_REFRESH_RATE; }
        if (options) {
            this.setOptions(options);
            this.setCurrentOptions(options);
        }
        this.isSimulationRunning = true;
        while (this.isSimulationRunning) {
            this.frame(refreshRate);
        }
        return this;
    };
    LoopSystemDefault.prototype.stopSimulation = function () {
        this.isSimulationRunning = false;
        return this;
    };
    LoopSystemDefault.prototype.setCurrentOptions = function (options) {
        var _this = this;
        options.speed = options.speed !== undefined ? Math.max(0, options.speed) : this.currentOptions.speed;
        this.afterFrameTasks.push(function () {
            _this.currentOptions = __assign({}, _this.currentOptions, options);
        });
        return this;
    };
    LoopSystemDefault.prototype.addAfterFrameTask = function (task) {
        this.afterFrameTasks.push(task);
        return this;
    };
    LoopSystemDefault.prototype.getOptions = function () {
        return __assign({}, this.options);
    };
    LoopSystemDefault.prototype.getCurrentOptions = function () {
        return __assign({}, this.currentOptions);
    };
    LoopSystemDefault.prototype.addCompute = function (name, compute) {
        this[name].push(compute instanceof Function ? { computeFn: compute } : compute);
        return this;
    };
    LoopSystemDefault.prototype.removeComputes = function (name, id) {
        var _this = this;
        if (id !== undefined) {
            var ids = Array.isArray(id) ? id : [id];
            ids.forEach(function (currId) {
                var computeIndex = _this[name].findIndex(function (compute) { return compute.id === currId; });
                if (computeIndex !== -1) {
                    _this[name].splice(computeIndex, 1);
                }
            });
        }
        else {
            this[name] = [];
        }
        return this;
    };
    LoopSystemDefault.prototype.setEnableComputes = function (name, enable, id) {
        var _this = this;
        if (id !== undefined) {
            var ids = Array.isArray(id) ? id : [id];
            ids.forEach(function (currId) {
                var computeIndex = _this[name].findIndex(function (compute) { return compute.id === currId; });
                if (computeIndex !== -1) {
                    _this[name][computeIndex].enable = enable;
                }
            });
        }
        else {
            this[name].forEach(function (compute) { return compute.enable = enable; });
        }
        return this;
    };
    LoopSystemDefault.prototype.removeAll = function () {
        this.removeComputes(loop_system_types_1.ComputeTypes.RENDERS);
        return this.removeComputes(loop_system_types_1.ComputeTypes.UPDATES);
    };
    ///////////////////////////////
    // PRIVATE METHODS
    ///////////////////////////////
    LoopSystemDefault.prototype.setOptions = function (options) {
        this.options = __assign({}, this.options, options);
        this.options.speed = Math.max(0, this.options.speed);
    };
    LoopSystemDefault.prototype.nextRequestAnimationFrame = function () {
        var _this = this;
        var now = window.performance.now();
        this.frame(now);
        this.requestAnimationFrameId = requestAnimationFrame(function () { return _this.nextRequestAnimationFrame(); });
    };
    LoopSystemDefault.prototype.frame = function (now) {
        utils_1.safeCompute(this.currentOptions.hooks.preProcess);
        utils_1.safeCompute(this.currentOptions.hooks.preUpdate);
        this.compute(loop_system_types_1.ComputeTypes.UPDATES, this.currentOptions.step, loop_system_types_1.Pipeline.PRE);
        this.updateWithSteps(now);
        this.compute(loop_system_types_1.ComputeTypes.UPDATES, this.currentOptions.step, loop_system_types_1.Pipeline.POST);
        utils_1.safeCompute(this.currentOptions.hooks.postUpdate);
        utils_1.safeCompute(this.currentOptions.hooks.preRender);
        var stepTimeForRender = this.currentOptions.renderWithTime ? this.currentOptions.step : 0;
        this.compute(loop_system_types_1.ComputeTypes.RENDERS, stepTimeForRender, loop_system_types_1.Pipeline.PRE);
        this.compute(loop_system_types_1.ComputeTypes.RENDERS, stepTimeForRender);
        this.compute(loop_system_types_1.ComputeTypes.RENDERS, stepTimeForRender, loop_system_types_1.Pipeline.POST);
        utils_1.safeCompute(this.currentOptions.hooks.postRender);
        utils_1.safeCompute(this.currentOptions.hooks.postProcess);
        this.manageAfterFrame();
    };
    LoopSystemDefault.prototype.manageAfterFrame = function () {
        this.afterFrameTasks.forEach(function (afterFrameTask) {
            afterFrameTask();
        });
        this.afterFrameTasks = [];
    };
    LoopSystemDefault.prototype.updateWithSteps = function (now) {
        this.dt += this.currentOptions.speed * Math.min(this.currentOptions.maxDt, (now - this.last) / 1000);
        while (this.dt > this.currentOptions.step) {
            this.dt -= this.currentOptions.step;
            utils_1.safeCompute(this.currentOptions.hooks.preUpdateStep);
            this.compute(loop_system_types_1.ComputeTypes.UPDATES, this.currentOptions.step);
            utils_1.safeCompute(this.currentOptions.hooks.postUpdateStep);
        }
        this.last = now;
    };
    LoopSystemDefault.prototype.compute = function (name, delta, pipeline) {
        this[name]
            .filter(function (computeEl) { return pipeline === computeEl.pipeline; })
            .sort(utils_1.sortWithOrder)
            .forEach(function (computeEl) {
            if (utils_1.safeBoolean(computeEl.enable)
                && (computeEl.isToCompute === undefined || computeEl.isToCompute(computeEl, delta))) {
                computeEl.computeFn(delta, computeEl);
            }
        });
    };
    return LoopSystemDefault;
}());
exports.LoopSystemDefault = LoopSystemDefault;
//# sourceMappingURL=../../src/src/loop/loop-system.js.map