import Cucumber from '../lib/cucumber';

describe('Cucumber', () => {
  it('should pick the right given rule', () => {
    const cucumber = new Cucumber();
    const rule1 = jest.fn();
    const rule2 = jest.fn();
    const rule3 = jest.fn();
    const rule4 = jest.fn();

    cucumber.defineGiven(/I have (\d+)/, rule1);
    cucumber.defineGiven(/I don't have (\d+)/, rule2);
    cucumber.defineWhen(/I have (\d+)/, rule3);
    cucumber.defineWhen(/I have (\d+)/, rule4);

    cucumber.given(null, 'I have 3');
    expect(rule1).toHaveBeenCalledTimes(1);
    expect(rule1).toHaveBeenCalledWith(null, "3");
    expect(rule2).not.toHaveBeenCalled();
    expect(rule3).not.toHaveBeenCalled();
    expect(rule4).not.toHaveBeenCalled();
  })

  it('should pick the right when rule', () => {
    const cucumber = new Cucumber();
    const rule1 = jest.fn();
    const rule2 = jest.fn();
    const rule3 = jest.fn();
    const rule4 = jest.fn();

    cucumber.defineWhen(/I have (\d+)/, rule1);
    cucumber.defineWhen(/I don't have (\d+)/, rule2);
    cucumber.defineGiven(/I have (\d+)/, rule3);
    cucumber.defineThen(/I have (\d+)/, rule4);

    cucumber.when(null, 'I have 3');
    expect(rule1).toHaveBeenCalledTimes(1);
    expect(rule1).toHaveBeenCalledWith(null, "3");
    expect(rule2).not.toHaveBeenCalled();
    expect(rule3).not.toHaveBeenCalled();
    expect(rule4).not.toHaveBeenCalled();
  })

  it('should pick the right then rule', () => {
    const cucumber = new Cucumber();
    const rule1 = jest.fn();
    const rule2 = jest.fn();
    const rule3 = jest.fn();
    const rule4 = jest.fn();

    cucumber.defineThen(/I have (\d+)/, rule1);
    cucumber.defineThen(/I don't have (\d+)/, rule2);
    cucumber.defineWhen(/I have (\d+)/, rule3);
    cucumber.defineGiven(/I have (\d+)/, rule4);

    cucumber.then(null, 'I have 3');
    expect(rule1).toHaveBeenCalledTimes(1);
    expect(rule1).toHaveBeenCalledWith(null, "3");
    expect(rule2).not.toHaveBeenCalled();
    expect(rule3).not.toHaveBeenCalled();
    expect(rule4).not.toHaveBeenCalled();
  })
})