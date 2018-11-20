'use strict';

const httpHelpers = {};

// Dependencies

httpHelpers._https = require('https');

httpHelpers.makeRequestAsync = function(url, options) {
  return new Promise(function(resolve, reject) {
    return httpHelpers._https.request(url, options, resolve).on('error', reject).end();
  });
};

httpHelpers.parseResponseData = function(res) {
  return new Promise(function(resolve, reject) {
    let rawData = '';
    res.on('data', data => rawData += data)
       .on('end', () => resolve(rawData))
       .on('error', reject);
  });
};

module.exports = httpHelpers;
