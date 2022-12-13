"use strict";


var unit = require("heya-unit");
var RE2  = require("../../..").RE2;


// tests

unit.add(module, [

	function test_inval(t) {
		"use strict";

		var threw;

		// Backreferences
		threw = false;
		try {
			new RE2(/(a)\1/u);
		} catch (e) {
			threw = true;
			eval(t.TEST("e instanceof SyntaxError"));
			eval(t.TEST("e.message.endsWith('invalid escape sequence: \\\\1')"));
		}
		t.test(threw);

		// Lookahead assertions

		// Positive
		threw = false;
		try {
			new RE2(/a(?=b)/u);
		} catch (e) {
			threw = true;
			eval(t.TEST("e instanceof SyntaxError"));
			eval(t.TEST("e.message.endsWith('invalid perl operator: (?=')"));
		}
		t.test(threw);

		// Negative
		threw = false;
		try {
			new RE2(/a(?!b)/u);
		} catch (e) {
			threw = true;
			eval(t.TEST("e instanceof SyntaxError"));
			eval(t.TEST("e.message.endsWith('invalid perl operator: (?!')"));
		}
		t.test(threw);
	},
]);
