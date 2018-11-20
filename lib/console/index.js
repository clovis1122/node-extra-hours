'use strict';

const customConsole = {};

// Dependencies

customConsole._console = require('console');

customConsole._buildColor = function([open, close]) {
  return function(text) {
    return `\u001B[${open}m${text}\u001B[${close}m`;
  };
};

customConsole._styles = {
  color: {
    red: customConsole._buildColor([31, 39]),
    yellow: customConsole._buildColor([33, 39]),
    blue: customConsole._buildColor([34, 39]),
    magenta: customConsole._buildColor([35, 39]),
    cyan: customConsole._buildColor([36, 39]),
    white: customConsole._buildColor([37, 39]),
  },
  modifier: {
    reset: customConsole._buildColor([0, 0]),
    bold: customConsole._buildColor([1, 22]),
    dim: customConsole._buildColor([2, 22]),
    italic: customConsole._buildColor([3, 23]),
    underline: customConsole._buildColor([4, 24]),
    inverse: customConsole._buildColor([7, 27]),
    hidden: customConsole._buildColor([8, 28]),
    strikethrough: customConsole._buildColor([9, 29])
  }
};

customConsole._prettifyStackTrace = function(error) {
  if (typeof(error) === 'string') return error;

  const message = 'ERROR: '+error.message;
  const newStack = error
    .stack
    .split('\n')
    .slice(1)
    .filter(line => line.indexOf('lib/test') === -1)
    .filter(line => line.indexOf('test/index.js:') === -1);

  newStack.unshift(message);
  return newStack.join('\n');
}

customConsole.log = function(text, options = {}) {
  let newText = text;
  if (options.color) newText = customConsole._styles.color[options.color](text);
  if (options.modifier) newText = customConsole._styles.modifier[options.modifier](text);

  customConsole._console.log(newText);
};

customConsole.print = customConsole.log;

customConsole.newLine = () => customConsole._console.log();
customConsole.bold = text => customConsole.log(text, { modifier: 'bold' });
customConsole.success = text => customConsole.log(text, { color: 'yellow' });
customConsole.error = error => customConsole.log(
  customConsole._prettifyStackTrace(error), { color: 'red' }
);
module.exports = customConsole;
