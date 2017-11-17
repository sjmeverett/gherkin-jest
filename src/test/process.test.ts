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

describe("Feature: " + "this is a test", () => {
  it("supports the scenario: " + "a scenario", () => {
    const world = cucumber.createWorld();
    cucumber.rule(world, "some givens");
    cucumber.rule(world, "I do a thing");
    cucumber.rule(world, "I will succeed");
  });
});`)
  })
})