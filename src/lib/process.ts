import { parse } from './parser';

export default function process(src: string, filename: string) {
  const feature = parse(src);

  return `
const {cucumber} = require("gherkin-jest");
const co = require("co");

${jestFn('describe', feature.attributes)}("Feature: " + ${JSON.stringify(feature.name)}, () => {${feature.scenarios.map((scenario) => `
  ${jestFn('it', scenario.attributes)}(${JSON.stringify(scenario.name)}, co.wrap(function *() {
    const world = cucumber.createWorld();
${scenario.rules.map((rule) => `    yield cucumber.rule(world, ${JSON.stringify(rule)});`).join('\n')}
  }));`).join('')}
});`;
}

function jestFn(name: string, attributes: string[]) {
  let attribute = '';

  if (attributes.indexOf('skip') > -1) {
    attribute = '.skip';
  } else if (attributes.indexOf('only') > -1) {
    attribute = '.only';
  }

  return name + attribute;
}