import { cucumber } from '../lib/cucumber';

cucumber.defineCreateWorld(() => ({
  a: null,
  b: null,
  answer: null
}));

cucumber.defineGiven(/^I have numbers (\d+) and (\d+)$/, (world, a, b) => {
  world.a = parseInt(a);
  world.b = parseInt(b);
});

cucumber.defineWhen(/^I (add|subtract|multiply|divide) them$/, (world, op) => {
  switch (op) {
    case 'add':
      world.answer = world.a + world.b;
      break;
    case 'subtract':
      world.answer = world.a - world.b;
      break;
    case 'multiply':
      world.answer = world.a * world.b;
      break;
    case 'divide':
      world.answer = world.a / world.b;
      break;
  }
});

cucumber.defineThen(/^I get (\d+)$/, (world, answer) => {
  expect(world.answer).toBe(parseInt(answer));
});
