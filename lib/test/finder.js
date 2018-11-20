'use strict';

const finder = {};

// Dependencies
finder._fs = require('fs');
finder._config = require('../../config');

// Export object

finder.getMatchingFiles = function(dirname, pattern) {
  return new Promise((resolve, reject) => {
    finder
      ._fs
      .readdir(dirname, { withFileTypes: true }, async function(err, files) {
        if (err) reject(err);
        const validFiles = [];
        try {
          await Promise.all(files.map(async (file) => {
            if (file.isDirectory()) {
              const dirValidFiles = await finder.getMatchingFiles(dirname+'/'+file.name, pattern);
              validFiles.push(...dirValidFiles);
            }
            if (pattern.test(file.name)) validFiles.push(dirname+'/'+file.name);
          }));
        } catch(e) {
          reject(e);
        }
        resolve(validFiles);
    });
  });
};



const testsDir = finder._config['TESTS_DIR'];
const matchTestJsFile = new RegExp(finder._config['TESTS_FILE_EXT_REGEX']);
const requireTestFile = files => files.forEach(require);
finder.loadTestFiles = () => finder.getMatchingFiles(testsDir, matchTestJsFile).then(requireTestFile);

module.exports = finder;
