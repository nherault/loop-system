import { safeBoolean, safeCompute, sortWithOrder } from './utils';
describe('utils', function () {
    describe('safeBoolean', function () {
        it('use safeBoolean', function () {
            expect(safeBoolean(undefined)).toBe(true);
            expect(safeBoolean(null)).toBe(null);
            expect(safeBoolean(false)).toBe(false);
            expect(safeBoolean(true)).toBe(true);
            expect(safeBoolean(function () { return true; })).toBe(true);
            expect(safeBoolean(function () { return false; })).toBe(false);
            expect(safeBoolean(function () { return undefined; })).toBe(undefined);
        });
    });
    describe('safeCompute', function () {
        it('use safeCompute', function () {
            var value = 0;
            safeCompute(undefined);
            expect(value).toBe(0);
            safeCompute(null);
            expect(value).toBe(0);
            safeCompute(function () { return value = 1; });
            expect(value).toBe(1);
        });
    });
    describe('sortWithOrder', function () {
        it('use sortWithOrder', function () {
            var arrayWithOrder = [
                { code: 'A1', order: 2 },
                { code: 'A2' },
                { code: 'A3', order: 1 },
                { code: 'A4', order: 3 },
                { code: 'A5' },
            ];
            expect(arrayWithOrder.sort(sortWithOrder)).toEqual([
                { code: 'A2' },
                { code: 'A5' },
                { code: 'A3', order: 1 },
                { code: 'A1', order: 2 },
                { code: 'A4', order: 3 },
            ]);
        });
    });
});
//# sourceMappingURL=../../src/src/utils/utils.spec.js.map