import Parser from './parser';

export default function process(src: string, filename: string) {
  const parser = new Parser(src, filename);
  const feature = parser.parse();

  return `
const {cucumber} = require("gherkin-jest");

describe("Feature: " + ${JSON.stringify(feature.name)}, () => {${feature.scenarios.map((scenario) => `
  it("supports the scenario: " + ${JSON.stringify(scenario.name)}, () => {
    ${mapRules('given', scenario.given)}
    ${mapRules('when', scenario.when)}
    ${mapRules('then', scenario.then)}
  });`).join('')}
});`;
}

function mapRules(fn: string, rules: string[]) {
  return rules.map((rule) => `cucumber.${fn}(${JSON.stringify(rule)});`).join('\n');
}
