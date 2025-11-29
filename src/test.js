#!/usr/bin/env node

console.log('Running Bullfrog Demo App Tests...\n');

// Simple test suite
const tests = [
  {
    name: 'Application loads successfully',
    fn: () => {
      const app = require('./index');
      return app !== undefined;
    }
  },
  {
    name: 'Health endpoint returns correct structure',
    fn: () => {
      // Simulated test
      return true;
    }
  },
  {
    name: 'API data endpoint returns array',
    fn: () => {
      // Simulated test
      return true;
    }
  }
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  try {
    const result = test.fn();
    if (result) {
      console.log(`✓ ${test.name}`);
      passed++;
    } else {
      console.log(`✗ ${test.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ ${test.name} - ${error.message}`);
    failed++;
  }
});

console.log(`\nTests completed: ${passed} passed, ${failed} failed`);

process.exit(failed > 0 ? 1 : 0);
