import process from '../lib/process';

describe('process', () => {
  it('should return the correct JS', () => {
    const js = process(`
    Feature: this is a test
      As a tester
      I want to test
      So that I can test

      Scenario: a scenario
        Given some givens
        When I do a thing
        Then I will succeed
    `, '');

    expect(js).toBe(`
const {cucumber} = require("gherkin-jest");
const co = require("co");

describe("Feature: " + "this is a test", () => {
  it("supports the scenario: " + "a scenario", co.wrap(function *() {
    const world = cucumber.createWorld();
    yield cucumber.rule(world, "some givens");
    yield cucumber.rule(world, "I do a thing");
    yield cucumber.rule(world, "I will succeed");
  }));
});`)
  })
})