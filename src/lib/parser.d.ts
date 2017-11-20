
export interface Feature {
  name: Clause;
  scenarios: Scenario[];
  attributes: string[];
}

export interface Scenario {
  name: Clause;
  rules: Clause[];
  attributes: string[];
}

export type Clause = string;

export function parse(source: string): Feature;
