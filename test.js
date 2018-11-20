'use strict';

const testCli = require('./lib/test/cli');

testCli.runTests().then(hasError => process.exit(hasError));
