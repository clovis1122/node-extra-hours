'use strict';

const expectObject = {};

// Dependencies

expectObject._assert = require('assert').strict;

expectObject.Expect = class Expect {
  constructor(value) {
    this.value = value;
  }

  toBe(val2) {
    expectObject._assert.deepEqual(
      this.value, 
      val2,
      `Failed asserting that the value '${this.value}' matches the given value '${val2}'`
    );
  }
};

expectObject.createExpect = value => new expectObject.Expect(value);
module.exports = expectObject;
