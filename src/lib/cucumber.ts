
export interface RuleHandler {
  (world: any, ...args: string[]): any;
}

interface Rule {
  regex: RegExp;
  handler: RuleHandler;
}

export default class Cucumber {
  private rules: Rule[] = [];
  private _createWorld: () => any;

  defineRule(regex: RegExp, handler: RuleHandler) {
    this.rules.push({regex, handler});
  }

  defineCreateWorld(_createWorld: () => any): void {
    this._createWorld = _createWorld;
  }

  rule(world: any, str: string): any {
    for (const rule of this.rules) {
      const match = str.match(rule.regex);

      if (match) {
        return rule.handler(world, ...match.slice(1));
      }
    }

    throw new Error(`Could not find matching rule: ${str}`);
  }

  createWorld(): any {
    return this._createWorld ? this._createWorld() : null;
  }
}

export const cucumber = new Cucumber();
