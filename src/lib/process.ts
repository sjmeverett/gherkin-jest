import { Transformer } from 'stucumber';

export default function process(src: string, filename: string) {
  const transformer = new Transformer<string>(
    (feature, scenarios) => `${jestFn('describe', feature.annotations)}("Feature: " + ${JSON.stringify(feature.name.value)}, () => {
      beforeAll(() => cucumber.enterFeature(${JSON.stringify(feature.annotations)}));
      afterAll(() => cucumber.exitFeature(${JSON.stringify(feature.annotations)}));
      ${scenarios.join('\n')}
    });`,
    (feature, scenario, rules) => `${jestFn('it', scenario.annotations)}(${JSON.stringify(scenario.name.value)}, co.wrap(function *() {
      const world = cucumber.createWorld();
      yield cucumber.enterScenario(world, ${JSON.stringify([...feature.annotations, ...scenario.annotations])});
      ${rules.join('\n')}
      yield cucumber.exitScenario(world, ${JSON.stringify([...feature.annotations, ...scenario.annotations])});
    }));`,
    (feature, scenario, rule) => `yield cucumber.rule(world, ${JSON.stringify(rule.value)});`
  );

  const js = transformer.transform(src);
  
  return `
  const {cucumber} = require("gherkin-jest");
  const co = require("co");

  ${js}
  `;
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