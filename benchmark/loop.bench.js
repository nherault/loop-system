/* eslint-disable */
const Benchmark = require('benchmark');
const loop = require('../lib/loop');

const suite = new Benchmark.Suite;

// add tests
suite
.add('loop', () => {
  
})
.add('loop', () => {
  
})
.add('loop', () => {
  
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
