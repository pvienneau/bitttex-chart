/*
    Reference: https://medium.com/@RubenOostinga/combining-chai-and-jest-matchers-d12d1ffd0303
    This script offers us the .toMatchSnapshot() function from Jest to be executed in Jest.
    There is an NPM package (https://github.com/suchipi/chai-jest-snapshot) that intends to do this,
    but at this moment the functionality seems restrictive.
*/
const chai = require('chai');

// Make sure chai and jasmine ".not" play nice together
const originalNot = Object.getOwnPropertyDescriptor(
    chai.Assertion.prototype,
    'not'
).get;

Object.defineProperty(chai.Assertion.prototype, 'not', {
    get() {
        Object.assign(this, this.assignedNot);

        return originalNot.apply(this);
    },
    set(newNot) {
        this.assignedNot = newNot;

        return newNot;
    },
});

// Combine both jest and chai matchers on expect
const originalExpect = global.expect;

global.expect = actual => {
    const originalMatchers = originalExpect(actual);
    const chaiMatchers = chai.expect(actual);
    const combinedMatchers = Object.assign(chaiMatchers, {
        toMatchSnapshot: originalMatchers.toMatchSnapshot,
    });

    return combinedMatchers;
};
