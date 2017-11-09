
export interface RuleHandler {
  (match: RegExpMatchArray): any;
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

  given(str: string);
  given(regex: RegExp, handler: RuleHandler);
  given(strOrRegex: string | RegExp, handler?: RuleHandler) {
    return this.registerOrRunRule(this.givenRules, "Given", strOrRegex, handler);
  }

  when(str: string);
  when(regex: RegExp, handler: RuleHandler);
  when(strOrRegex: string | RegExp, handler?: RuleHandler) {
    return this.registerOrRunRule(this.whenRules, "When", strOrRegex, handler);
  }

  then(str: string);
  then(regex: RegExp, handler: RuleHandler);
  then(strOrRegex: string | RegExp, handler?: RuleHandler) {
    return this.registerOrRunRule(this.thenRules, "Then", strOrRegex, handler);
  }

  private runMatchingRule(rules: Rule[], str: string, clause: string): any {
    for (const rule of rules) {
      const match = str.match(rule.regex);

      if (match) {
        return rule.handler(match);
      }
    }

    throw new Error(`Could not matching rule: ${clause} ${str}`);
  }

  private registerOrRunRule(
    rules: Rule[],
    clause: Clause,
    strOrRegex: string | RegExp,
    handler?: RuleHandler
  ) {
    if (typeof strOrRegex === 'string') {
      return this.runMatchingRule(rules, strOrRegex, clause);
    } else {
      rules.push({
        regex: strOrRegex,
        handler
      });
    }
  }
}

export const cucumber = new Cucumber();
