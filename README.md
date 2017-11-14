# gherkin-jest

Now you can run tests written in gherkin using jest.

## Usage

First, install:

    $ yarn add --dev gherkin-jest

Then, add to your jest config:

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

cucumber.given(/^I have numbers (\d+) and (\d+)$/, (world, a, b) => {
  world.a = parseInt(a);
  world.b = parseInt(b);
});

cucumber.when(/^I add them$/, (world) => {
  world.answer = world.a + world.b;
});

cucumber.then(/^I get (\d+)$/, (world, answer) => {
  expect(world.answer).toBe(parseInt(answer));
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

That's it!
