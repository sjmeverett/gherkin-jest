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
      scenarios: [
        {
          name: "this is a test",
          rules: [
            "that I am testing",
            "I am still testing",
            "also that I test",
            "I test",
            "test",
            "continue testing",
            "I want to test",
            "test",
            "test"
          ],
          annotations: []
        }
      ],
      annotations: []
    });
  });

  it("should parse a scenario outline", () => {
    const result = parse(
      `
      Feature: foo
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
      scenarios: [
        {
          name: "this is a scenario outline",
          rules: ["that I have abc", "I 123", "I -£*%"],
          annotations: []
        }
      ],
      annotations: []
    });
  });


  it("should parse a scenario with annotations", () => {
    const result = parse(
      `
      @annotation1
      Feature: foo
        @annotation2
        @annotation3
        Scenario: this is a test
          * a thing
    `
    );

    expect(result).toEqual({
      name: "foo",
      scenarios: [
        {
          name: "this is a test",
          rules: [
            "a thing"
          ],
          annotations: ["annotation2", "annotation3"]
        }
      ],
      annotations: ["annotation1"]
    });
  });
});
