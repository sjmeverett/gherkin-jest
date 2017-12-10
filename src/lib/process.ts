import {Transformer} from 'stucumber';
import {SourceNode} from 'source-map';
import {readFileSync} from 'fs';

require('source-map-support').install({
  environment: 'node',
  
  retrieveFile: (path: string) => {
    path = path.trim();
    
    try {
      return process(readFileSync(path, 'utf8'), path);
    } catch (e) {
       return null;
    }
  }
})

export default function process(src: string, filename: string) {
  const transformer = new Transformer<any>(
    (feature, scenarios) =>
      new SourceNode(feature.name.location.line, feature.name.location.column, filename, [
        jestFn('describe', feature.annotations),
        `("Feature: " + `,
        JSON.stringify(feature.name.value),
        `, () => {`,
        `beforeAll(() => cucumber.enterFeature(${JSON.stringify(feature.annotations)}));`,
        `afterAll(() => cucumber.exitFeature(${JSON.stringify(feature.annotations)}));`,
        new SourceNode(feature.name.location.line, feature.name.location.column, filename, scenarios),
        `});`
      ]),
    (feature, scenario, rules) =>
      new SourceNode(scenario.name.location.line, scenario.name.location.column, filename, [
        jestFn('it', scenario.annotations),
        `(`,
        JSON.stringify(scenario.name.value),
        `, () => {`,
        `const world = cucumber.createWorld();`,
        `return cucumber.enterScenario(world, `,
        JSON.stringify([...feature.annotations, ...scenario.annotations]),
        `)`,
        ...[].concat(...rules),
        `.then(() => cucumber.exitScenario(world, `,
        JSON.stringify([...feature.annotations, ...scenario.annotations]),
        `));`,
        `});`
      ]),
    (feature, scenario, rule) => [
      `.then(() => `,
      new SourceNode(rule.location.line, rule.location.column, filename, [
        `cucumber.rule(world, `,
        JSON.stringify(rule.value),
        `)`
      ]),
      `)`
    ]
  );

  const js = new SourceNode(
    1,
    1,
    filename, [
      `const {cucumber} = require("gherkin-jest");`,
      `const co = require("co");`,
      transformer.transform(src)
    ]
  );

  const code = js.toStringWithSourceMap({file: filename});

  return code.code 
    + '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,'
    + Buffer.from(code.map.toString(), 'utf8').toString('base64');
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
