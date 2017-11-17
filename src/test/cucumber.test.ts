import Cucumber from '../lib/cucumber';

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
});
