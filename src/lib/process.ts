import { parse } from './parser';

export default function process(src: string, filename: string) {
  const feature = parse(src);

  return `
const {cucumber} = require("gherkin-jest");
const co = require("co");

describe("Feature: " + ${JSON.stringify(feature.name)}, () => {${feature.scenarios.map((scenario) => `
  it("supports the scenario: " + ${JSON.stringify(scenario.name)}, co.wrap(function *() {
    const world = cucumber.createWorld();
${scenario.rules.map((rule) => `    yield cucumber.rule(world, ${JSON.stringify(rule)});`).join('\n')}
  }));`).join('')}
});`;
}
