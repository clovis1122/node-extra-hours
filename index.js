'use strict';

const extraHoursCli = require('./lib/cli');

extraHoursCli.start().then(hasError => process.exit(hasError));

 