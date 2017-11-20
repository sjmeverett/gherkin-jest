export interface RuleHandler {
  (world: any, ...args: string[]): any;
}

interface Rule {
  regex: RegExp;
  handler: RuleHandler;
}

const types = {
  string: { regex: '"([^"]+)"' },
  int: { regex: "([-+]?\\d+)", converter: parseInt },
  float: { regex: "([-+]?\\d*(?:\\.\\d+)?)", converter: parseFloat },
  word: { regex: "([^\\s]+)" }
};

export default class Cucumber {
  private rules: Rule[] = [];
  private _createWorld: () => any;

  defineRule(match: string, handler: RuleHandler);
  defineRule(match: RegExp, handler: RuleHandler);
  defineRule(match: string | RegExp, handler: RuleHandler) {
    if (match instanceof RegExp) {
      this.rules.push({ regex: match, handler });
    } else {
      this.rules.push(this.compileTemplate(match, handler));
    }
  }

  private compileTemplate(match: string, handler: RuleHandler) {
    const converters: ((x: string) => any)[] = [];

    const regex = match.replace(
      /\{([a-zA-Z-_]+)\}/g,
      (placeholder, typeName) => {
        const type = types[typeName];

        if (!type) {
          throw new Error(`Invalid placeholder '${placeholder}'`);
        }

        converters.push(type.converter);
        return type.regex;
      }
    );

    const convertHandler = (world, ...params: string[]) =>
      handler(
        world,
        ...params.map(
          (value, i) =>
            typeof converters[i] === "function" ? converters[i](value) : value
        )
      );

    return { regex: new RegExp(`^${regex}$`), handler: convertHandler };
  }

  defineCreateWorld(_createWorld: () => any): void {
    this._createWorld = _createWorld;
  }

  rule(world: any, str: string): any {
    for (const rule of this.rules) {
      const match = str.match(rule.regex);

      if (match) {
        return Promise.resolve(rule.handler(world, ...match.slice(1)));
      }
    }

    throw new Error(`Could not find matching rule: ${str}`);
  }

  createWorld(): any {
    return this._createWorld ? this._createWorld() : null;
  }
}

export const cucumber = new Cucumber();
