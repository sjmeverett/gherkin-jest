
export interface RuleHandler {
  (world: any, ...args: string[]): any;
}

interface Rule {
  regex: RegExp;
  handler: RuleHandler;
}

type Clause = "Given" | "When" | "Then";

export default class Cucumber {
  private givenRules: Rule[] = [];
  private whenRules: Rule[] = [];
  private thenRules: Rule[] = [];
  private _createWorld: () => any;

  defineGiven(regex: RegExp, handler: RuleHandler) {
    this.givenRules.push({regex, handler});
  }

  defineWhen(regex: RegExp, handler: RuleHandler) {
    this.whenRules.push({regex, handler});
  }

  defineThen(regex: RegExp, handler: RuleHandler) {
    this.thenRules.push({regex, handler});
  }
  
  defineCreateWorld(_createWorld: () => any): void {
    this._createWorld = _createWorld;
  }

  given(world: any, str: string) {
    return this.runMatchingRule(this.givenRules, "Given", world, str);
  }
  
  when(world: any, str: string) {
    return this.runMatchingRule(this.whenRules, "When", world, str);
  }
    
  then(world: any, str: string) {
    return this.runMatchingRule(this.thenRules, "Then", world, str);
  }

  createWorld(): any {
    return this._createWorld();
  }

  private runMatchingRule(rules: Rule[], clause: string, world: any, str: string): any {
    for (const rule of rules) {
      const match = str.match(rule.regex);

      if (match) {
        return rule.handler(world, ...match.slice(1));
      }
    }

    throw new Error(`Could not find matching rule: ${clause} ${str}`);
  }
}

export const cucumber = new Cucumber();
