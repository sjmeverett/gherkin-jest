import Parser from "../lib/parser";

describe("Parser", () => {
  it("should parse a standard scenario", () => {
    const parser = new Parser(
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
    `,
      "filename"
    );

    expect(parser.parse()).toEqual({
      name: "foo",
      actor: "a user",
      want: "to test",
      reason: "I can test",
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
    const parser = new Parser(
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
            | \\|t  | test | test |
      `,
      "filename"
    );

    expect(parser.parse()).toEqual({
      name: "foo",
      actor: "a user",
      want: "to test",
      reason: "I can test",
      scenarios: [
        {
          name: "this is a scenario outline",
          given: ["that I have abc"],
          when: ["I 123"],
          then: ["I -£*%"]
        },
        {
          name: "this is a scenario outline",
          given: ["that I have |t"],
          when: ["I test"],
          then: ["I test"]
        }
      ]
    });
  });
});
