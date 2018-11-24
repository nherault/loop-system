/* eslint-disable */
const Benchmark = require('benchmark');
const utils = require('../lib/utils');

const suite = new Benchmark.Suite;

const arrayWithOrder = [
  { code: 'A1', order: 2 },
  { code: 'A2' },
  { code: 'A3', order: 1 },
  { code: 'A4', order: 3 },
  { code: 'A5' },
];

// add tests
suite
.add('utils.safeBoolean', () => {
  utils.safeBoolean(true);
})
.add('utils.safeBoolean fct', () => {
  utils.safeBoolean(() => true);
})
.add('utils.safeCompute', () => {
  utils.safeCompute(() => value = 1);
})
.add('utils.sortWithOrder', () => {
  arrayWithOrder.sort(utils.sortWithOrder);
})
// add listeners
.on('cycle', (event) => {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
  console.log('Slowest is ' + this.filter('slowest').map('name'));
})
// run async
.run({ 'async': true });
