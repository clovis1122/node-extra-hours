'use strict';

const customConsole = require('../index');

describe('Custom console suite', function() {
  test('Log function prints the given message', function() {
    const messageToPrint = 'Message';
    let logged = false;

    customConsole._console = {};
    customConsole._console.log = text => logged = text === messageToPrint;
    customConsole.log(messageToPrint);

    expect(logged).toBe(true);
  });

  test('Newline function prints nothing', function() {
    const messageToPrint = undefined;
    let logged = false;

    customConsole._console = {};
    customConsole._console.log = text => logged = text === messageToPrint;
    customConsole.newLine();

    expect(logged).toBe(true);
  });

  test('Bold function prints the text bolder (ASCII)', function() {
    const message = 'bold';
    const messageToPrint = `\u001B[1m${message}\u001B[22m`;
    let logged = false;

    customConsole._console = {};
    customConsole._console.log = text => logged = text === messageToPrint;
    customConsole.bold(message);

    expect(logged).toBe(true);
  });

  test('Success function prints the text yellow (ASCII)', function() {
    const message = 'yellow';
    const messageToPrint = `\u001B[33m${message}\u001B[39m`;
    let logged = false;

    customConsole._console = {};
    customConsole._console.log = text => logged = text === messageToPrint;
    customConsole.success(message);

    expect(logged).toBe(true);
  });

  test('Error function prints a string message in red (ASCII)', function() {
    const message = 'error';
    const messageToPrint = `\u001B[31m${message}\u001B[39m`;
    let logged = false;

    customConsole._console = {};
    customConsole._console.log = text => logged = text === messageToPrint;
    customConsole.error(message);

    expect(logged).toBe(true);
  });

  test('Error function accepts an error object and print the details in red (ASCII)', function() {
    const error = new Error();
    const firstStackTrace = 'Line1';
    error.message = 'There was an error';
    error.stack = 'At Exec\n'+firstStackTrace;

    const messageToPrint = `\u001B[31mERROR: ${error.message}\n${firstStackTrace}\u001B[39m`;
    let logged = false;

    customConsole._console = {};
    customConsole._console.log = text => logged = text === messageToPrint;
    customConsole.error(error);

    expect(logged).toBe(true);
  });

});
