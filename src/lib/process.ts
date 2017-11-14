import { parse } from './parser';

export default function process(src: string, filename: string) {
  const feature = parse(src);

  return `
const {cucumber} = require("gherkin-jest");

describe("Feature: " + ${JSON.stringify(feature.name)}, () => {${feature.scenarios.map((scenario) => `
  it("supports the scenario: " + ${JSON.stringify(scenario.name)}, () => {
    const world = cucumber.createWorld();
    ${mapRules('given', scenario.given)}
    ${mapRules('when', scenario.when)}
    ${mapRules('then', scenario.then)}
  });`).join('')}
});`;
}

function mapRules(fn: string, rules: string[]) {
  return rules.map((rule) => `cucumber.${fn}(world, ${JSON.stringify(rule)});`).join('\n');
}
