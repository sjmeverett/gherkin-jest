# gherkin-jest

Now you can run tests written in gherkin using jest.

## Usage

First, install:

    $ yarn add --dev gherkin-jest

Then, add to your jest config:

```
"transform": {
  "^.+\\.feature$": "gherkin-jest"
}
```

That's it!
