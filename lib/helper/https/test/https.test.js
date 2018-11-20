'use strict';

const httpsHelper = require('../index');
const EventEmitter = require('events');
class CustomEmitter extends EventEmitter {}

describe('HTTPS helper suite', function() {
  test('It can make an async request', async function() {
    const url = 'bla';
    const options = { key: 'value' };
    let usedHttps = false;

    httpsHelper._https = {
      request(_url, _options, resolve) {
        usedHttps = true;
        expect(_url).toBe(url);
        expect(_options).toBe(options);
        resolve({});
      }
    };

    await httpsHelper.makeRequestAsync(url, options);
    expect(usedHttps).toBe(true);
  });

  test('It can read the sent data async from a response', async function() {
    const emitter = new CustomEmitter();
    const dataPromise = httpsHelper.parseResponseData(emitter);

    emitter.emit('data', 'Content');
    emitter.emit('data', '123');
    emitter.emit('end');

    const response = await dataPromise;
    expect(response).toBe('Content123');
  });

});
