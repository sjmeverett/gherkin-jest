
export interface Feature {
  name: Clause;
  actor: Clause;
  want: Clause;
  reason: Clause;
  scenarios: Scenario[];
}

export interface Scenario {
  name: Clause;
  given: Clause[];
  when: Clause[];
  then: Clause[];
}

export type Clause = string;

export function parse(source: string): Feature;
