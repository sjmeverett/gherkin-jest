
export interface Feature {
  name: Clause;
  scenarios: Scenario[];
  annotations: string[];
}

export interface Scenario {
  name: Clause;
  rules: Rule[];
  annotations: string[];
}

export interface Rule {
  rule: String;
  table?: Clause[][];
}

export type Clause = string;

export function parse(source: string): Feature;
