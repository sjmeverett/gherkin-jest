import { parse } from "../lib/parser";

describe("Parser", () => {
  it("should parse a standard scenario", () => {
    const result = parse(
      `
      Feature: foo
        As a user
        I want to test
        So that I can test
      
        Scenario: this is a test
          Given that I am testing
          And I am still testing
          And also that I test
          When I test
          And test
          And continue testing
          Then I want to test
          And test
          And test
    `
    );

    expect(result).toEqual({
      name: "foo",
      actor: "a user",
      want: "to test",
      reason: "that I can test",
      scenarios: [
        {
          name: "this is a test",
          given: [
            "that I am testing",
            "I am still testing",
            "also that I test"
          ],
          when: ["I test", "test", "continue testing"],
          then: ["I want to test", "test", "test"]
        }
      ]
    });
  });

  it("should parse a scenario outline", () => {
    const result = parse(
      `
      Feature: foo
        As a user
        I want to test
        So that I can test
      
        Scenario Outline: this is a scenario outline
          Given that I have <given>
          When I <when>
          Then I <then>
      
          Examples:
            | given | when | then |
            | abc   | 123  | -£*% |
      `
    );

    expect(result).toEqual({
      name: "foo",
      actor: "a user",
      want: "to test",
      reason: "that I can test",
      scenarios: [
        {
          name: "this is a scenario outline",
          given: ["that I have abc"],
          when: ["I 123"],
          then: ["I -£*%"]
        }
      ]
    });
  });
});
