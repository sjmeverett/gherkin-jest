import process from '../lib/process';
import { readFileSync } from 'fs';

describe('process', () => {
  it('should return the correct JS', () => {
    const js = process(readFileSync(__dirname + '/test.feature', 'utf8'), 'test.js');

    expect(js).toMatchSnapshot();
  })
})