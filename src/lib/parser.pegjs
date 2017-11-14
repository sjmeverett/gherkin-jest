{
  function expandTemplateString(template, example) {
    return template.replace(/<([^>]+)>/g, (_, key) => example[key]);
  }

  function zip(keys, values) {
    const obj = {};

    for (let i = 0; i < keys.length; i++) {
      obj[keys[i]] = values[i];
    }

    return obj;
  }
}

Feature
  = _ TFeature name:String NL _ TAs actor:String NL _ TIWant want:String NL _ TSo reason:String NL _ scenarios:Scenarios
	{ return { name, actor, want, reason, scenarios } }

Scenarios
  = scenario:Scenario NL scenarios:Scenarios
  { return [...scenario, ...scenarios] }

  / scenario:Scenario _
  { return [...scenario] }
          
Scenario = _ TScenario name:String NL _ given:Givens NL when:Whens NL then:Thens
  { return [{ name, given, when, then }] }

  / _ TScenarioOutline name:String NL _ given:Givens NL when:Whens NL then:Thens NL examples:Examples
  { 
    return examples.map((example) => ({
      name: expandTemplateString(name, example),
      given: given.map((template) => expandTemplateString(template, example)),
      when: when.map((template) => expandTemplateString(template, example)),
      then: then.map((template) => expandTemplateString(template, example))
    }));
  }

Givens
  = given:Given NL ands:Ands
  { return [given, ...ands] }
       
  / given:Given
  { return [given] }

Whens
  = when:When NL ands:Ands
  { return [when, ...ands] }

  / when:When
	{ return [when] }
	
Thens
  = then:Then NL ands:Ands
  { return [then, ...ands] }
      
  / then:Then
	{ return [then] }
	
Examples
  = _ TExamples NL table:Table
  {
    const keys = table[0];
    const data = [];
    const rows = table.slice(1);

    for (const row of rows) {
      const rowData = zip(keys, row);
      data.push(rowData);
    }

    return data;
  }

Table
  = row:TableRow NL rows:Table
  { return [row, ...rows] }

  / row:TableRow
  { return [row] }

TableRow
  = _ cells:TableCells
  { return cells }
         
TableCells
  = TTableSep cell:TTableCell cells:TableCells
  { return [cell, ...cells] }

  / TTableSep cell:TTableCell TTableSep
  { return [cell] }

Given
  = _ TGiven str:String
  { return str }

When
  = _ TWhen str:String
  { return str }

Then
  = _ TThen str:String
  { return str }

Ands
  = and:And NL ands:Ands
  { return [and, ...ands] }
     
  / and:And
	{ return [and] }

And
  = _ TAnd clause:String
  { return clause; }

TFeature = "Feature:"
TAs = "As"
TIWant = "I want"

TSo
  = "So"
	/ "In order"

TScenario = "Scenario:"
TScenarioOutline = "Scenario Outline:"
TGiven = "Given"
TWhen = "When"
TThen = "Then"
TAnd = "And"
TExamples = "Examples:"
TTableSep = "|"

TTableCell
  = data:[^|\n]+
  { return data.join('').trim() }

String
  = str:[^\n]+
	{ return str.join('').trim() }

NL = "\n"

_ = WS Comment _
  / WS

Comment = "//" String NL

WS "whitespace"
  = [ \t\n\r]*
  