import { safeBoolean, safeCompute, sortWithOrder } from './utils';

describe('utils', () => {
    describe('safeBoolean', () => {
      it('use safeBoolean', () => {
        expect(safeBoolean(undefined)).toBe(true);
        expect(safeBoolean(null)).toBe(null);
        expect(safeBoolean(false)).toBe(false);
        expect(safeBoolean(true)).toBe(true);
        expect(safeBoolean(() => true)).toBe(true);
        expect(safeBoolean(() => false)).toBe(false);
        expect(safeBoolean(() => undefined)).toBe(undefined);
      });
    });

    describe('safeCompute', () => {

      it('use safeCompute', () => {
        let value = 0;
        safeCompute(undefined);
        expect(value).toBe(0);
        safeCompute(null);
        expect(value).toBe(0);
        safeCompute(() => value = 1);
        expect(value).toBe(1);
      });
    });

    describe('sortWithOrder', () => {

      it('use sortWithOrder', () => {
        const arrayWithOrder = [
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
