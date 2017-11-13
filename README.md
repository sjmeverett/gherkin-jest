# gherkin-jest

Now you can run tests written in gherkin using jest.

## Usage

First, install:

    $ yarn add --dev gherkin-jest

Then, add to your jest config:

```
"transform": {
  "^.+\\.feature$": "gherkin-jest"
},
"setupFiles": ["<rootDir>/test/support"]
```

Define your steps in the setup file:

```js
const { cucumber } = require('gherkin-jest');

let a;
let b;
let answer;

cucumber.given(/^I have numbers (\d+) and (\d+)$/, (match) => {
  a = parseInt(match[1]);
  b = parseInt(match[2]);
});

cucumber.when(/^I add them$/, (match) => {
  answer = a + b;
});

cucumber.then(/^I get (\d+)$/, (match) => {
  expect(answer).toBe(parseInt(match[1]));
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
