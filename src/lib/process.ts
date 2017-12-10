import {GenericTransformer} from 'stucumber';
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
});

export default function process(source: string, filename: string) {
  const transformer = new GenericTransformer({
    featureFn: 'describe',
    scenarioFn: 'it',
    beforeAllFn: 'beforeAll',
    afterAllFn: 'afterAll'
  });

  return transformer.transform(filename, source);
}
