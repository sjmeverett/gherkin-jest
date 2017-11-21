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

cucumber.defineRule(/^I have numbers (\d+) and (\d+)$/, (world, a, b) => {
  world.a = parseInt(a);
  world.b = parseInt(b);
});

cucumber.defineRule(/^I add them$/, (world) => {
  world.answer = world.a + world.b;
});

cucumber.defineRule(/^I get (\d+)$/, (world, answer) => {
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

## Other features

### Template strings

You can write your rules using the template string style notation:

```js
cucumber.defineRule('I have numbers {int} and {int}', (world, a, b) => {
  world.a = a;
  world.b = b;
});
```

There are 4 types that can be used as placeholders:

 * `{int}` - matches an integer (`[-+]?\d+`) and runs `parseInt` on it before passing into your handler
 * `{float}` - matches a floating point number (`[-+]?\d*(\.\d+)?`) and runs `parseFloat` on it before passing on
 * `{word}` - matches a bunch of characters up to a whitespace character (`[^\s]+`)
 * `{string}` - matches a double-quoted string and returns only the contents of the string (`"([^"]+)"`)


###  Promises

Any rule can return a promise and it will be awaited before processing the next rule.

### Annotations

You can prefix any feature or scenario with any number of annotations, which consist of a keyword prefixed by an `@` symbol:

```gherkin
@skip
Feature: I don't want this test to be run
  Scenario: a simple arithmetic test
    Given I have numbers 3 and 4
    When I add them
    Then I get 7
```

Currently there are two "special" annotations which have defined behaviour:

 * `@skip` - skips the test - outputs a `describe.skip` or `it.skip` for features and scenarios respectively
 * `@only` - only runs the annotated test - outputs a `describe.only` or `it.only` depending on the annotated item

Anything else is ignored, so could be useful for metadata, e.g. recording the associated issue number.
