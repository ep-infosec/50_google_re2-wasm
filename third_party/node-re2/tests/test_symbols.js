"use strict";


var unit = require("heya-unit");
var RE2  = require("../../..").RE2;


// tests

unit.add(module, [
	function test_match_symbol (t) {
		"use strict";

		if (typeof Symbol == 'undefined' || !Symbol.match) return;

		var str = "For more information, see Chapter 3.4.5.1";

		var re = new RE2(/(chapter \d+(\.\d)*)/iu);
		var result = str.match(re);

		eval(t.TEST("result.input === str"));
		eval(t.TEST("result.index === 26"));
		eval(t.TEST("result.length === 3"));
		eval(t.TEST("result[0] === 'Chapter 3.4.5.1'"));
		eval(t.TEST("result[1] === 'Chapter 3.4.5.1'"));
		eval(t.TEST("result[2] === '.1'"));
	},
	function test_search_symbol (t) {
		"use strict";

		if (typeof Symbol == 'undefined' || !Symbol.search) return;

		var str = "Total is 42 units.";

		var re = new RE2(/\d+/iu);
		var result = str.search(re);
		eval(t.TEST("result === 9"));

		re = new RE2("\\b[a-z]+\\b", 'u');
		result = str.search(re);
		eval(t.TEST("result === 6"));

		re = new RE2("\\b\\w+\\b", 'u');
		result = str.search(re);
		eval(t.TEST("result === 0"));

		re = new RE2("z", "gmu");
		result = str.search(re);
		eval(t.TEST("result === -1"));
	},
	function test_replace_symbol (t) {
		"use strict";

		if (typeof Symbol == 'undefined' || !Symbol.replace) return;

		var re = new RE2(/apples/giu);
		var result = "Apples are round, and apples are juicy.".replace(re, "oranges");
		eval(t.TEST("result === 'oranges are round, and oranges are juicy.'"));

		re = new RE2(/xmas/iu);
		result = "Twas the night before Xmas...".replace(re, "Christmas");
		eval(t.TEST("result === 'Twas the night before Christmas...'"));

		re = new RE2(/(\w+)\s(\w+)/u);
		result = "John Smith".replace(re, "$2, $1");
		eval(t.TEST("result === 'Smith, John'"));
	},
	function test_split(t) {
		"use strict";

		if (typeof Symbol == 'undefined' || !Symbol.split) return;

		var re = new RE2(/\s+/u);
		var result = "Oh brave new world that has such people in it.".split(re);
		eval(t.TEST("t.unify(result, ['Oh', 'brave', 'new', 'world', 'that', 'has', 'such', 'people', 'in', 'it.'])"));

		re = new RE2(",", 'u');
		result = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(re);
		eval(t.TEST("t.unify(result, ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'])"));

		re = new RE2(/\s*;\s*/u);
		result = "Harry Trump ;Fred Barney; Helen Rigby ; Bill Abel ;Chris Hand ".split(re);
		eval(t.TEST("t.unify(result, ['Harry Trump', 'Fred Barney', 'Helen Rigby', 'Bill Abel', 'Chris Hand '])"));

		re = new RE2(/\s+/u);
		result = "Hello World. How are you doing?".split(re, 3);
		eval(t.TEST("t.unify(result, ['Hello', 'World.', 'How'])"));

		re = new RE2(/(\d)/u);
		result = "Hello 1 word. Sentence number 2.".split(re);
		eval(t.TEST("t.unify(result, ['Hello ', '1', ' word. Sentence number ', '2', '.'])"));

		eval(t.TEST("'asdfghjkl'.split(new RE2(/[x-z]*/u)).reverse().join('') === 'lkjhgfdsa'"));
	}
]);
