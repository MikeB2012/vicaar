"use strict";

var fs = require("fs");
var map = require("through2-map").obj;
var csvparse = require("csv-parse");
var nd = require("ndjson");
var par = require("par")
var reduceStream = require('reduce-stream-to-promise');

function processRow( whiten, rowObject) {
	var keys = Object.keys(whiten);
	var rowKeys = Object.keys(rowObject);
	var output = rowObject[rowKeys[rowKeys.length-1]];
	var row = keys.map(function (key) {
		var value = rowObject[key];
		var min = whiten[key].min;
		var max = whiten[key].max;
		return rowObject[key] = (value - min)/(max - min);
	});

	var result = {
		input: row,
		output: output
	};
	return result;
}

reduceStream(function(result, item){
	var keys = Object.keys(item);
	keys = keys.slice(0, keys.length - 1);
	for(var key of keys){
		var value = item[key];
		var current = result[key] || {};
		if (typeof value === "string") value = parseFloat(value);
		if(typeof value === "number"){
			if (!current.min) current.min = value;
			if (!current.max) current.max = value;
			if(current.min > value)
				current.min = value;
			if(current.max < value)
				current.max = value;
		}
		result[key] = current;
	}
	return result;
}, {}, dataStream())
	.then(function(whiteningCOnfig){
		dataStream()
			.pipe(map(par(processRow, whiteningCOnfig)))
			.pipe(nd.serialize())
			.pipe(process.stdout);
	}).catch(function(e){
		console.error(e.stack);
	});

function dataStream() {
	var input = fs.createReadStream("../data/bezdekIris.data");
	var parse = csvparse({delimiter: "," , columns: true});
	return input.pipe(parse);
}
