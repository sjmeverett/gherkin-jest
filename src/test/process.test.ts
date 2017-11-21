import process from '../lib/process';

describe('process', () => {
  it('should return the correct JS', () => {
    const js = process(`
    @someAttribute
    Feature: this is a test
      As a tester
      I want to test
      So that I can test

      @some-other-attribute
      Scenario: a scenario
        Given some givens
        When I do a thing
        Then I will succeed
    `, '');

    expect(js).toBe(`
const {cucumber} = require("gherkin-jest");
const co = require("co");

describe("Feature: " + "this is a test", () => {
  beforeAll(() => cucumber.enterFeature(["someAttribute"]));
  afterAll(() => cucumber.exitFeature(["someAttribute"]));
  it("a scenario", co.wrap(function *() {
    const world = cucumber.createWorld();
    yield cucumber.enterScenario(world, ["someAttribute","some-other-attribute"]);
    yield cucumber.rule(world, "some givens");
    yield cucumber.rule(world, "I do a thing");
    yield cucumber.rule(world, "I will succeed");
    yield cucumber.exitScenario(world, ["someAttribute","some-other-attribute"]);
  }));
});`)
  })
})