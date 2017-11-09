import Cucumber from '../lib/cucumber';

describe('Cucumber', () => {
  it('should pick the right given rule', () => {
    const cucumber = new Cucumber();
    const rule1 = jest.fn();
    const rule2 = jest.fn();
    const rule3 = jest.fn();
    const rule4 = jest.fn();

    cucumber.given(/I have (\d+)/, rule1);
    cucumber.given(/I don't have (\d+)/, rule2);
    cucumber.when(/I have (\d+)/, rule3);
    cucumber.then(/I have (\d+)/, rule4);

    cucumber.given('I have 3');
    expect(rule1).toHaveBeenCalledTimes(1);
    expect([...rule1.mock.calls[0][0]]).toEqual(['I have 3', '3']);
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

    cucumber.when(/I have (\d+)/, rule1);
    cucumber.when(/I don't have (\d+)/, rule2);
    cucumber.given(/I have (\d+)/, rule3);
    cucumber.then(/I have (\d+)/, rule4);

    cucumber.when('I have 3');
    expect(rule1).toHaveBeenCalledTimes(1);
    expect([...rule1.mock.calls[0][0]]).toEqual(['I have 3', '3']);
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

    cucumber.then(/I have (\d+)/, rule1);
    cucumber.then(/I don't have (\d+)/, rule2);
    cucumber.when(/I have (\d+)/, rule3);
    cucumber.given(/I have (\d+)/, rule4);

    cucumber.then('I have 3');
    expect(rule1).toHaveBeenCalledTimes(1);
    expect([...rule1.mock.calls[0][0]]).toEqual(['I have 3', '3']);
    expect(rule2).not.toHaveBeenCalled();
    expect(rule3).not.toHaveBeenCalled();
    expect(rule4).not.toHaveBeenCalled();
  })
})