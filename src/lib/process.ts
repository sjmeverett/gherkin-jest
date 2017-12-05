import { parse } from './parser';

export default function process(src: string, filename: string) {
  const feature = parse(src);

  const js = `
const {cucumber} = require("gherkin-jest");
const co = require("co");

${jestFn('describe', feature.annotations)}("Feature: " + ${JSON.stringify(feature.name)}, () => {${feature.scenarios.map((scenario) => `
  beforeAll(() => cucumber.enterFeature(${JSON.stringify(feature.annotations)}));
  afterAll(() => cucumber.exitFeature(${JSON.stringify(feature.annotations)}));
  ${jestFn('it', scenario.annotations)}(${JSON.stringify(scenario.name)}, co.wrap(function *() {
    const world = cucumber.createWorld();
    yield cucumber.enterScenario(world, ${JSON.stringify([...feature.annotations, ...scenario.annotations])});
${scenario.rules.map(({ rule, table }) => `    yield cucumber.rule(world, ${JSON.stringify(rule)}${ table ? ', ' + JSON.stringify(table) : ''});`).join('\n')}
    yield cucumber.exitScenario(world, ${JSON.stringify([...feature.annotations, ...scenario.annotations])});
  }));`).join('')}
});`;

  return js;
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
