"use strict";

var fs = require("fs");
var map = require("through2-map").obj;
var csvparse = require("csv-parse");
var nd = require("ndjson");

var input = fs.createReadStream("../data/bezdekIris.data");
var parse = csvparse({delimiter: ',', from: 2});
function processRow(rowObject) {
	var length = rowObject.length;
	var output = rowObject[length - 1];
	var input = rowObject.reduce(function (acc, curr, index) {
		if (index < length - 1) {
			acc = acc.concat(curr);
		}
		return acc;
	},[]);
	var result = {
		input: input,
		output: output
	};
	return result;
};

input
	.pipe(parse)
	.pipe(map(processRow))
	.pipe(nd.serialize())
	.pipe(process.stdout);