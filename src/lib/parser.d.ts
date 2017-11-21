
export interface Feature {
  name: Clause;
  scenarios: Scenario[];
  annotations: string[];
}

export interface Scenario {
  name: Clause;
  rules: Clause[];
  annotations: string[];
}

export type Clause = string;

export function parse(source: string): Feature;
