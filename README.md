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

### Hooks

You can register functions to handle various hooks:

  * `HookType.BeforeAll` - runs once at the beginning of each feature
  * `HookType.BeforeEach` - runs at the beginning of each scenario, just after the call to `createWorld`
  * `HookType.AfterAll` - runs once at the end of each feature
  * `HookType.AfterEach` - runs at the end of each scenario

To register a handler, call `cucumber.addHook`:

```js
cucumber.addHook(HookType.BeforeEach, (world, attributes) => {
  // do some stuff
})
```

The handler functions get two parameters:

  * `world` - the world object returned from `createWorld` - for `BeforeAll` and `AfterAll` this is not relevant and is always `null`
  * `attributes` - a string array of any attributes defined on the feature and/or scenario (if relevant)

You can use the attributes parameter to do custom setup behaviour depending on attributes set on the test.  Note that a scenario
gets the attributes from both the feature and that scenario.

### Multiline tabular data

You can define data tables in your specs with
```gherkin
Feature: Using tables
  Scenario: lots of data
    Given lots of data
      | Header 1 | Header 2 | Header 3 |
      | Value 1a | Value 1b | Value 1c |
      | Value 2a | Value 2b | Value 2c |
    When I use 3 key-value pairs
      | Key 1 | Value 1 |
      | Key 2 | Value 2 |
      | Key 3 | Value 3 |
    Then I can access all that data
```

And write rules for them like so
```js
cucumber.defineRule(/^lots of data$/, (world, table) => {
  expect(table.hash['Header 2']).toEqual([ 'Value 1b', 'Value 2b' ])
  expect(table.raw).toEqual([
     [ 'Header 1', 'Header 2', 'Header 3' ],
     [ 'Value 1a', 'Value 1b', 'Value 1c' ],
     [ 'Value 2a', 'Value 2b', 'Value 2c' ],
  ])
});

cucumber.defineRule(/^I use (\d+) key-value pairs$/, (world, number, table) => {
  expect(number).toEqual(3)
  expect(table.rowHash['Key 2']).toEqual('Value 2')
  expect(table.raw).toEqual([
    [ 'Key 1', 'Value 1' ],
    [ 'Key 2', 'Value 2' ],
    [ 'Key 3', 'Value 3' ],
  ])
});
```
