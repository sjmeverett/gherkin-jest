# gherkin-jest

Now you can run tests written in gherkin using jest.

## Usage

First, install:

    $ yarn add --dev gherkin-jest

Then, add to your [jest config](https://facebook.github.io/jest/docs/en/configuration.html):

```json
"transform": {
  "^.+\\.feature$": "gherkin-jest"
},
"setupFiles": ["<rootDir>/test/support"],
"testMatch": ["**/*.test.ts", "**/*.feature"],
"moduleFileExtensions": ["js", "jsx", "ts", "tsx", "feature"],
```

Define your steps in the setup file:

```js
const { cucumber } = require('gherkin-jest');

cucumber.defineCreateWorld(() => {
  return {
    a: null,
    b: null,
    answer: null
  }
})

cucumber.defineRule('I have numbers {int} and {int}', (world, a, b) => {
  world.a = a;
  world.b = b;
});

cucumber.defineRule('I add them', (world) => {
  world.answer = world.a + world.b;
});

cucumber.defineRule('I get {int}', (world, answer) => {
  expect(world.answer).toBe(answer);
});
```

Write a test:

```gherkin
Feature: using feature files in jest
  As a developer
  I want to write tests in cucumber
  So that the business can understand my tests

  Scenario: a simple arithmetic test
    Given I have numbers 3 and 4
    When I add them
    Then I get 7
```

## More documentation

This package just wraps the [stucumber](https://www.npmjs.com/package/stucumber) package to make a
Jest transformer.  More details on the flavour of Gherkin used and how to set up supporting code can
be found in that package's documentation.
