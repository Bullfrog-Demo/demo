#!/usr/bin/env node

const https = require('https');
const http = require('http');

console.log('Bullfrog Network Connection Test\n');
console.log('This script attempts connections to various domains to demonstrate Bullfrog blocking/auditing.\n');

const testConnections = [
  {
    name: 'GitHub API (allowed)',
    url: 'https://api.github.com',
    expected: 'Should be allowed in most configurations'
  },
  {
    name: 'Docker Hub (registry-1.docker.io)',
    url: 'https://registry-1.docker.io',
    expected: 'Blocked unless explicitly allowed'
  },
  {
    name: 'NPM Registry (registry.npmjs.org)',
    url: 'https://registry.npmjs.org',
    expected: 'Commonly needed for package installation'
  },
  {
    name: 'Google DNS (google.com)',
    url: 'https://www.google.com',
    expected: 'Blocked unless explicitly allowed'
  },
  {
    name: 'Example Domain (example.com)',
    url: 'https://example.com',
    expected: 'Blocked unless explicitly allowed'
  },
  {
    name: 'PyPI (pypi.org)',
    url: 'https://pypi.org',
    expected: 'Blocked unless explicitly allowed'
  }
];

function testConnection(testCase) {
  return new Promise((resolve) => {
    const url = new URL(testCase.url);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname || '/',
      method: 'GET',
      timeout: 5000
    };

    const protocol = url.protocol === 'https:' ? https : http;

    const req = protocol.request(options, (res) => {
      console.log(`✓ ${testCase.name}: Connected (Status: ${res.statusCode})`);
      console.log(`  ${testCase.expected}\n`);
      resolve({ success: true, name: testCase.name });
    });

    req.on('error', (error) => {
      console.log(`✗ ${testCase.name}: ${error.message}`);
      console.log(`  ${testCase.expected}\n`);
      resolve({ success: false, name: testCase.name, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`✗ ${testCase.name}: Timeout`);
      console.log(`  ${testCase.expected}\n`);
      resolve({ success: false, name: testCase.name, error: 'Timeout' });
    });

    req.end();
  });
}

async function runTests() {
  console.log(`Testing ${testConnections.length} connections...\n`);

  const results = [];

  for (const test of testConnections) {
    const result = await testConnection(test);
    results.push(result);
  }

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('='.repeat(60));
  console.log(`Summary: ${successful} successful, ${failed} failed/blocked`);
  console.log('='.repeat(60));

  // Exit with 0 even if some connections fail - this is expected in block mode
  process.exit(0);
}

runTests().catch(error => {
  console.error('Error running network tests:', error);
  process.exit(1);
});
