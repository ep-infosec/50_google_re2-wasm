"use strict";


var unit = require("heya-unit");
var RE2  = require("../../..").RE2;


// tests

unit.add(module, [

	// These tests are copied from MDN:
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec

	function test_execBasic(t) {
		"use strict";

		var re = new RE2("quick\\s(brown).+?(jumps)", "igu");

		eval(t.TEST("re.source === 'quick\\\\s(brown).+?(jumps)'"));
		eval(t.TEST("re.ignoreCase"));
		eval(t.TEST("re.global"));
		eval(t.TEST("!re.multiline"));

		var result = re.exec("The Quick Brown Fox Jumps Over The Lazy Dog");

		eval(t.TEST("t.unify(result, ['Quick Brown Fox Jumps', 'Brown', 'Jumps'])"));
		eval(t.TEST("result.index === 4"));
		eval(t.TEST("result.input === 'The Quick Brown Fox Jumps Over The Lazy Dog'"));
		eval(t.TEST("re.lastIndex === 25"));
	},
	function test_execSucc(t) {
		"use strict";

		var str = "abbcdefabh";

		var re = new RE2("ab*", "gu");
		var result = re.exec(str);

		eval(t.TEST("!!result"));
		eval(t.TEST("result[0] === 'abb'"));
		eval(t.TEST("result.index === 0"));
		eval(t.TEST("re.lastIndex === 3"));

		result = re.exec(str);

		eval(t.TEST("!!result"));
		eval(t.TEST("result[0] === 'ab'"));
		eval(t.TEST("result.index === 7"));
		eval(t.TEST("re.lastIndex === 9"));

		result = re.exec(str);

		eval(t.TEST("!result"));
	},
	function test_execSimple(t) {
		"use strict";

		var re = new RE2("(hello \\S+)", "u");
		var result = re.exec("This is a hello world!");

		eval(t.TEST("result[1] === 'hello world!'"));
	},
	function test_execFail(t) {
		"use strict";

		var re = new RE2("(a+)?(b+)?", "u");
		var result = re.exec("aaabb");

		eval(t.TEST("result[1] === 'aaa'"));
		eval(t.TEST("result[2] === 'bb'"));

		result = re.exec("aaacbb");

		eval(t.TEST("result[1] === 'aaa'"));
		eval(t.TEST("result[2] === undefined"));
		eval(t.TEST("result.length === 3"));
	},
	function test_execAnchoredToBeginning(t) {
		"use strict";

		var re = new RE2('^hello', 'gu');

		var result = re.exec("hellohello");

		eval(t.TEST("t.unify(result, ['hello'])"));
		eval(t.TEST("result.index === 0"));
		eval(t.TEST("re.lastIndex === 5"));

		eval(t.TEST("re.exec('hellohello') === null"));
	},
	function test_execInvalid(t) {
		"use strict";

		var re = new RE2('', 'u');

		try {
			re.exec({ toString() { throw "corner"; } });
			t.test(false); // shouldn't be here
		} catch(e) {
			eval(t.TEST("e === 'corner'"));
		}
	},
	function test_execAnchor1(t) {
		"use strict";

		var re = new RE2("b|^a", "gu");

		var result = re.exec("aabc");
		eval(t.TEST("!!result"));
		eval(t.TEST("result.index === 0"));
		eval(t.TEST("re.lastIndex === 1"));

		result = re.exec("aabc");
		eval(t.TEST("!!result"));
		eval(t.TEST("result.index === 2"));
		eval(t.TEST("re.lastIndex === 3"));

		result = re.exec("aabc");
		eval(t.TEST("!result"));
	},
	function test_execAnchor2(t) {
		"use strict";

		var re = new RE2("(?:^a)", "gu");

		var result = re.exec("aabc");
		eval(t.TEST("!!result"));
		eval(t.TEST("result.index === 0"));
		eval(t.TEST("re.lastIndex === 1"));

		result = re.exec("aabc");
		eval(t.TEST("!result"));
	},

	// Unicode tests

	function test_execUnicode(t) {
		"use strict";

		var re = new RE2("охотник\\s(желает).+?(где)", "igu");

		eval(t.TEST("re.source === 'охотник\\\\s(желает).+?(где)'"));
		eval(t.TEST("re.ignoreCase"));
		eval(t.TEST("re.global"));
		eval(t.TEST("!re.multiline"));

		var result = re.exec("Каждый Охотник Желает Знать Где Сидит Фазан");

		eval(t.TEST("t.unify(result, ['Охотник Желает Знать Где', 'Желает', 'Где'])"));
		eval(t.TEST("result.index === 7"));
		eval(t.TEST("result.input === 'Каждый Охотник Желает Знать Где Сидит Фазан'"));
		eval(t.TEST("re.lastIndex === 31"));

		eval(t.TEST("result.input.substr(result.index) === 'Охотник Желает Знать Где Сидит Фазан'"));
		eval(t.TEST("result.input.substr(re.lastIndex) === ' Сидит Фазан'"));
	},
	function test_execUnicodeSubsequent(t) {
		"use strict";

		var str = "аббвгдеабё";

		var re = new RE2("аб*", "gu");
		var result = re.exec(str);

		eval(t.TEST("!!result"));
		eval(t.TEST("result[0] === 'абб'"));
		eval(t.TEST("result.index === 0"));
		eval(t.TEST("re.lastIndex === 3"));

		result = re.exec(str);

		eval(t.TEST("!!result"));
		eval(t.TEST("result[0] === 'аб'"));
		eval(t.TEST("result.index === 7"));
		eval(t.TEST("re.lastIndex === 9"));

		result = re.exec(str);

		eval(t.TEST("!result"));
	},
	function test_execUnicodeSupplementary(t) {
		"use strict";

		var re = new RE2("\\u{1F603}", "gu");

		eval(t.TEST("re.source === '\\\\u{1F603}'"));
		eval(t.TEST("re.internalSource === '\\\\x{1F603}'"));
		eval(t.TEST("!re.ignoreCase"));
		eval(t.TEST("re.global"));
		eval(t.TEST("!re.multiline"));

		var result = re.exec("\u{1F603}"); // 1F603 is the SMILING FACE WITH OPEN MOUTH emoji

		eval(t.TEST("t.unify(result, ['\\u{1F603}'])"));
		eval(t.TEST("result.index === 0"));
		eval(t.TEST("result.input === '\\u{1F603}'"));
		eval(t.TEST("re.lastIndex === 2"));

		var re2 = new RE2(".", "gu");

		eval(t.TEST("re2.source === '.'"));
		eval(t.TEST("!re2.ignoreCase"));
		eval(t.TEST("re2.global"));
		eval(t.TEST("!re2.multiline"));

		var result2 = re2.exec("\u{1F603}");

		eval(t.TEST("t.unify(result2, ['\\u{1F603}'])"));
		eval(t.TEST("result2.index === 0"));
		eval(t.TEST("result2.input === '\\u{1F603}'"));
		eval(t.TEST("re2.lastIndex === 2"));

		var re3 = new RE2("[\u{1F603}-\u{1F605}]", "gu");

		eval(t.TEST("re3.source === '[\u{1F603}-\u{1F605}]'"));
		eval(t.TEST("!re3.ignoreCase"));
		eval(t.TEST("re3.global"));
		eval(t.TEST("!re3.multiline"));

		var result3 = re3.exec("\u{1F604}");

		eval(t.TEST("t.unify(result3, ['\\u{1F604}'])"));
		eval(t.TEST("result3.index === 0"));
		eval(t.TEST("result3.input === '\\u{1F604}'"));
		eval(t.TEST("re3.lastIndex === 2"));
	},

	// Sticky tests

	function test_execSticky(t) {
		"use strict";

		var re = new RE2("\\s+", "yu");

		eval(t.TEST("re.exec('Hello world, how are you?') === null"));

		re.lastIndex = 5;

		var result = re.exec("Hello world, how are you?");

		eval(t.TEST("t.unify(result, [' '])"));
		eval(t.TEST("result.index === 5"));
		eval(t.TEST("re.lastIndex === 6"));

		var re2 = new RE2("\\s+", "gyu");

		eval(t.TEST("re2.exec('Hello world, how are you?') === null"));

		re2.lastIndex = 5;

		var result2 = re2.exec("Hello world, how are you?");

		eval(t.TEST("t.unify(result2, [' '])"));
		eval(t.TEST("result2.index === 5"));
		eval(t.TEST("re2.lastIndex === 6"));
  },

  // Multiline test

  function test_execMultiline(t) {
		"use strict";

    const re = new RE2("^xy", "mu"),
      pattern = ` xy1
xy2 (at start of line)
  xy3`;

    const result = re.exec(pattern);

		eval(t.TEST("!!result"));
		eval(t.TEST("result[0] === 'xy'"));
		eval(t.TEST("result.index > 3"));
		eval(t.TEST("result.index < pattern.length - 4"));
    eval(t.TEST("result[0] === pattern.substr(result.index, result[0].length)"));
  }
]);
