#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Run TypeScript compiler with strict settings to find all issues
const tscArgs = [
  '--noEmit',
  '--strict',
  '--noUnusedLocals',
  '--noUnusedParameters',
  '--skipLibCheck',
  '--exactOptionalPropertyTypes',
  '--noUncheckedIndexedAccess'
];

console.log('🔍 Running comprehensive TypeScript check...');

const tsc = spawn('npx', ['tsc', ...tscArgs], {
  stdio: 'pipe',
  cwd: process.cwd()
});

let output = '';
let errors = '';

tsc.stdout.on('data', (data) => {
  output += data.toString();
});

tsc.stderr.on('data', (data) => {
  errors += data.toString();
});

tsc.on('close', (code) => {
  console.log('\n📊 TypeScript Check Results:');
  console.log('=' .repeat(50));
  
  if (code === 0) {
    console.log('✅ No TypeScript errors found!');
  } else {
    console.log('❌ TypeScript errors found:');
    
    // Filter out library definition errors
    const filteredErrors = errors.split('\n').filter(line => 
      !line.includes('babel__') && 
      !line.includes('d3-') &&
      line.trim().length > 0
    );
    
    if (filteredErrors.length > 0) {
      console.log('\n🔴 Source Code Errors:');
      filteredErrors.forEach(line => console.log(line));
    } else {
      console.log('\n💡 Only library definition errors found (can be ignored)');
    }
  }
  
  console.log('\n' + '='.repeat(50));
  process.exit(code === 0 ? 0 : 1);
});