'use strict';

const cli = {};

// Dependencies
cli._finder = require('./finder');

cli._expect = require('./expect');
cli._customConsole = require('../console');
cli._moduleObject = require('module');

cli._testSuite = {};
cli._currentSuite = null;

cli._createDone = (resolve, reject) => error => error ? resolve() : reject(error);

cli._doneify = (fn) => {
  if (fn.length === 0) return fn();
  return new Promise(async function(resolve, reject) {
    const done = cli._createDone(resolve, reject);
    try {
      await fn(done);
    } catch(e) {
      reject(e);
    }
  });
};

cli._executeTestSuite = async function(suite) {
  cli._customConsole.bold('Running test suite: '+suite.name);

  suite.exec();

  for (const test of suite.tests) {
    cli._customConsole.log('>>> '+test.name);
    let error = null;

    try {
      await cli._doneify(test.func);
    } catch(e) {
      error = e;
    }
    suite.testResults.push({ name: test.name, error });
  }
};

// Require all the files in this directory that ends in '*.test.js'.
cli._runAllTestSuite = async function() {
  cli._customConsole.bold('Running test suites...');
  const testSuiteEntries = Object.values(cli._testSuite);

  for (const suite of testSuiteEntries) {
    cli._customConsole.newLine();
    cli._currentSuite = suite;
    await cli._executeTestSuite(suite);
  }

  cli._customConsole.log('\nResult:');
  let hasError = false;

  for (const suite of testSuiteEntries) {
    cli._customConsole.log('\n> '+suite.name);
    suite.testResults.forEach(test => {
      cli._customConsole.log('>>> '+test.name+': '+ (test.error ? 'FAIL' : 'PASS'));
      if (test.error) {
        cli._customConsole.error(test.error);
        hasError = true;
        cli._customConsole.newLine();
      }
    });
  }
  cli._customConsole.newLine();
  
  if (hasError) {
    cli._customConsole.error(
      'ERROR: Some tests failed. Please check the test suite for more information.'
    );
  } else {
    cli._customConsole.success(
      'SUCCESS: All tests passed!'
    );
  }

  cli._customConsole.newLine();

  return hasError;
};

cli._describe = function(name, exec) {
  cli._testSuite[name] = { name, exec, tests: [], testResults: [] };
};

cli._test = (name, func) => cli._currentSuite.tests.push({ name, func });

cli._addGlobalVars = function() {
  global.describe = cli._describe;
  global.test = cli._test;
  global.expect = cli._expect.createExpect;
};

cli._addRequireCacheInvalidation = function() {
  const originalRequire = cli._moduleObject.prototype.require;

  cli._moduleObject.prototype.require = function(path) {
    const loadPath = cli._moduleObject._resolveFilename(path, this);
    delete require.cache[loadPath];
    return originalRequire.call(this, loadPath);
  }
}

cli.runTests = function() {
  cli._addGlobalVars();
  cli._addRequireCacheInvalidation();
  return cli._finder.loadTestFiles().then(cli._runAllTestSuite);
};


module.exports = cli;
