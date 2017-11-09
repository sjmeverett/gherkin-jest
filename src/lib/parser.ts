interface Token {
  regex: RegExp;
  name: string;
}

interface Example {
  [key: string]: string;
}

export interface Feature {
  name: string;
  actor: string;
  want: string;
  reason: string;
  scenarios: Scenario[];
}

export interface Scenario {
  name: string;
  given: string[];
  when: string[];
  then: string[];
}

function simpleToken(what: string): Token {
  return {
    regex: new RegExp(`^\\s*${what}(.*)$`),
    name: `"${what.trim()}"`
  };
}

const TOKENS = {
  newLine: <Token>{ regex: /\r?\n/, name: "new line" },
  feature: simpleToken("Feature:"),
  as: simpleToken("As "),
  want: simpleToken("I want "),
  soThat: simpleToken("So that "),
  inOrder: simpleToken("In order "),
  scenario: simpleToken("Scenario:"),
  scenarioOutline: simpleToken("Scenario Outline:"),
  given: simpleToken("Given "),
  when: simpleToken("When "),
  then: simpleToken("Then "),
  and: simpleToken("And "),
  examples: simpleToken("Examples:"),
  examplesTableRow: <Token>{
    regex: /^\s*\|(.*)\|\s*$/,
    name: "examples table row"
  }
};

function expandTemplateString(template: string, example: Example): string {
  return template.replace(/<([^>]+)>/g, (_, key) => example[key]);
}

function zip(keys: string[], values: string[]) {
  const obj: Example = {};

  for (let i = 0; i < keys.length; i++) {
    obj[keys[i]] = values[i];
  }

  return obj;
}

export default class Parser {
  private lines: string[];
  private currentLine: number;
  private filename: string;
  private lastToken: Token;

  constructor(src, filename) {
    this.lines = src
      .split(TOKENS.newLine.regex)
      .filter(line => !/^\s*$/.test(line));

    this.currentLine = 0;
    this.filename = filename;
  }

  eof(): boolean {
    return this.currentLine >= this.lines.length;
  }

  parse(): Feature {
    return this.parseFeature();
  }

  parseFeature(): Feature {
    const feature: Feature = {
      name: this.expect(TOKENS.feature),
      actor: this.expect(TOKENS.as),
      want: this.expect(TOKENS.want),
      reason: this.expect([TOKENS.soThat, TOKENS.inOrder]),
      scenarios: []
    };

    while (!this.eof()) {
      feature.scenarios.push(...this.parseScenario());
    }

    return feature;
  }

  parseScenario(): Scenario[] {
    const name = this.expect([TOKENS.scenario, TOKENS.scenarioOutline]);
    const isOutline = this.lastToken === TOKENS.scenarioOutline;

    const scenario: Scenario = {
      name,
      given: [],
      when: [],
      then: []
    };

    scenario.given.push(this.expect(TOKENS.given));
    this.parseAnds(scenario.given);

    scenario.when.push(this.expect(TOKENS.when));
    this.parseAnds(scenario.when);

    scenario.then.push(this.expect(TOKENS.then));
    this.parseAnds(scenario.then);

    if (isOutline) {
      const examples = this.parseExamples();
      return this.expandScenarioOutline(scenario, examples);
    } else {
      return [scenario];
    }
  }

  private expandScenarioOutline(
    scenario: Scenario,
    examples: Example[]
  ): Scenario[] {
    return examples.map(example => ({
      name: expandTemplateString(scenario.name, example),
      given: scenario.given.map(template =>
        expandTemplateString(template, example)
      ),
      when: scenario.when.map(template =>
        expandTemplateString(template, example)
      ),
      then: scenario.then.map(template =>
        expandTemplateString(template, example)
      )
    }));
  }

  private parseExamples(): Example[] {
    const examples = [];
    this.expect(TOKENS.examples);

    const header = this.parseExamplesTableRow(
      this.expect(TOKENS.examplesTableRow)
    );
    let row;

    while ((row = this.maybe(TOKENS.examplesTableRow))) {
      const fields = this.parseExamplesTableRow(row);

      if (fields.length !== header.length) {
        this.syntaxError(`table row "${row}" doesn't have the same number of columns as the header`);
      }

      examples.push(zip(header, fields));
    }

    return examples;
  }

  private parseExamplesTableRow(row): string[] {
    return row.split(/[^\\]\|/).map(cell => cell.trim().replace("\\|", "|"));
  }

  private parseAnds(arr: string[]): void {
    let and: string;

    while ((and = this.maybe(TOKENS.and))) {
      arr.push(and);
    }
  }

  private getLine(): string {
    if (this.eof()) {
      return "";
    } else {
      return this.lines[this.currentLine];
    }
  }

  private expect(token: Token | Token[], group = 1): string {
    const line = this.getLine();
    const tokens = Array.isArray(token) ? token : [token];

    for (const t of tokens) {
      const match = line.match(t.regex);

      if (match) {
        this.currentLine++;
        this.lastToken = t;
        return match[group].trim();
      }
    }

    const expected = tokens.map(token => token.name).join(", ");

    this.syntaxError(
      `expected ${expected}, not "${this.lines[this.currentLine]}"`
    );
  }

  private syntaxError(message: string) {
    throw new Error(
      `Syntax error (${this.filename}:${this.currentLine}): ${message}"`
    );
  }

  private maybe(token: Token, group = 1): string {
    const line = this.getLine();
    const match = line.match(token.regex);

    if (match) {
      this.currentLine++;
      return match[group];
    } else {
      return null;
    }
  }
}
