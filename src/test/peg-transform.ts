import * as peg from 'pegjs';

export function process(src: string) {
  const out = peg.buildParser(src, {
    output: 'source'
  });

  return 'module.exports = ' + out;
}