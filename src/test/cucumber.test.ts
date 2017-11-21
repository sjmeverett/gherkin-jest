import Cucumber, { HookType } from '../lib/cucumber';

describe('Cucumber', () => {
  it('should pick the right rule', () => {
    const cucumber = new Cucumber();
    const rule1 = jest.fn();
    const rule2 = jest.fn();
    const rule3 = jest.fn();
    const rule4 = jest.fn();

    cucumber.defineRule(/I have (\d+)/, rule1);
    cucumber.defineRule(/I don't have (\d+)/, rule2);
    cucumber.defineRule(/I might have (\d+)/, rule3);

    cucumber.rule(null, 'I have 3');
    expect(rule1).toHaveBeenCalledTimes(1);
    expect(rule1).toHaveBeenCalledWith(null, "3");
    expect(rule2).not.toHaveBeenCalled();
    expect(rule3).not.toHaveBeenCalled();
  });

  it('should support the string template style', () => {
    const cucumber = new Cucumber();
    const rule = jest.fn((world, str, int, float, word) => {
      expect(str).toBe('some sort of string');
      expect(int).toBe(-4);
      expect(float).toBe(3.14);
      expect(word).toBe('potatoes');
    });

    cucumber.defineRule('string {string} int {int} float {float} word {word}', rule);
    cucumber.rule(null, 'string "some sort of string" int -4 float 3.14 word potatoes');
    expect(rule).toHaveBeenCalled();
  });

  it('should run beforeAll hooks on enterFeature', () => {
    const cucumber = new Cucumber();
    const hook = jest.fn();
    const dummy = jest.fn();
    cucumber.addHook(HookType.BeforeAll, hook);
    cucumber.addHook(HookType.AfterAll, dummy);

    cucumber.enterFeature(['foo']);
    expect(hook).toHaveBeenCalledWith(null, ['foo']);
    expect(dummy).not.toHaveBeenCalled();
  });
  
  it('should run beforeEach hooks on enterScenario', () => {
    const cucumber = new Cucumber();
    const hook = jest.fn();
    const dummy = jest.fn();
    cucumber.addHook(HookType.BeforeEach, hook);
    cucumber.addHook(HookType.AfterAll, dummy);

    cucumber.enterScenario(1, ['foo']);
    expect(hook).toHaveBeenCalledWith(1, ['foo']);
    expect(dummy).not.toHaveBeenCalled();
  });
  
  it('should run afterAll hooks on exitFeature', () => {
    const cucumber = new Cucumber();
    const hook = jest.fn();
    const dummy = jest.fn();
    cucumber.addHook(HookType.AfterAll, hook);
    cucumber.addHook(HookType.BeforeAll, dummy);

    cucumber.exitFeature(['foo']);
    expect(hook).toHaveBeenCalledWith(null, ['foo']);
    expect(dummy).not.toHaveBeenCalled();
  });
  
  it('should run afterEach hooks on exitScenario', () => {
    const cucumber = new Cucumber();
    const hook = jest.fn();
    const dummy = jest.fn();
    cucumber.addHook(HookType.AfterEach, hook);
    cucumber.addHook(HookType.BeforeAll, dummy);

    cucumber.exitScenario(1, ['foo']);
    expect(hook).toHaveBeenCalledWith(1, ['foo']);
    expect(dummy).not.toHaveBeenCalled();
  });
});
