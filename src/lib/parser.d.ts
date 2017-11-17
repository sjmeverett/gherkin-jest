
export interface Feature {
  name: Clause;
  scenarios: Scenario[];
}

export interface Scenario {
  name: Clause;
  rules: Clause[];
}

export type Clause = string;

export function parse(source: string): Feature;
