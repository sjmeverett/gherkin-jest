import { cucumber } from '../lib/cucumber';

let a: number;
let b: number;
let answer: number;

cucumber.given(/^I have numbers (\d+) and (\d+)$/, (match) => {
  a = parseInt(match[1]);
  b = parseInt(match[2]);
});

cucumber.when(/^I (add|subtract|multiply|divide) them$/, (match) => {
  switch (match[1]) {
    case 'add':
      answer = a + b;
      break;
    case 'subtract':
      answer = a - b;
      break;
    case 'multiply':
      answer = a * b;
      break;
    case 'divide':
      answer = a / b;
      break;
  }
});

cucumber.then(/^I get (\d+)$/, (match) => {
  expect(answer).toBe(parseInt(match[1]));
});
