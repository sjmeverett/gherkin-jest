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
            { rule: "that I am testing" },
            { rule: "I am still testing" },
            { rule: "also that I test" },
            { rule: "I test" },
            { rule: "test" },
            { rule: "continue testing" },
            { rule: "I want to test" },
            { rule: "test" },
            { rule: "test" }
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
          rules: [ 
            { rule: "that I have abc" },
            { rule: "I 123" },
            { rule: "I -£*%" }
          ],
          annotations: []
        }
      ],
      annotations: []
    });
  });

  it("should use hashtag for the comment character", () => {
    const result = parse(
      `
      # foobar
      Feature: foo
        # comment
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
            { rule: "a thing" }
          ],
          annotations: []
        }
      ],
      annotations: []
    });
  });

  it("should parse data tables", () => {
    const result = parse(
      `
      Feature: foo
        Scenario: test with data
          Given some data
            | Header1 | Header2 | Header3 |
            | Cell1 | Cell2 | Cell3 |
          Then something else
    `
    );

    expect(result).toEqual({
      name: "foo",
      scenarios: [
        {
          name: "test with data",
          rules: [
            { 
              rule: "some data",
              table: [
                [ 'Header1', 'Header2', 'Header3' ],
                [ 'Cell1', 'Cell2', 'Cell3' ]
              ]
            },
            {
              rule: "something else"
            }
          ],
          annotations: []
        }
      ],
      annotations: []
    });

  })

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
            { rule: "a thing" }
          ],
          annotations: ["annotation2", "annotation3"]
        }
      ],
      annotations: ["annotation1"]
    });
  });
});
