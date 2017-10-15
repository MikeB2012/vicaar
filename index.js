"use strict";
var fs = require("fs-extra");

var eos = require("then-eos");
var ndjson = require("ndjson");

var brain = require("brain.js");
var NeuralNetwork = brain.NeuralNetwork;

module.exports = {
	load: load,
	save: save,
	run: run,
	train: train,
};

function load(location, options) {
	if(!location) {
		console.log("Creating new network", options);
		return Promise.resolve(new NeuralNetwork(options));
	}

	console.log("Loading", location);

	return fs.readFile(location, "utf8").then(function(json){
		var parsed = JSON.parse(json);
		var net = new NeuralNetwork();
		net.fromJSON(parsed);
		return net;
	});
}

function save(location, net) {
	console.log("Saving", location, data);
	var data = net.toJSON();
	var json = JSON.stringify(data, null, "\t");
	return fs.writeFile(location, json, "utf8");
}

function run(depth, net, data) {
	return fs.readFile(data).then(function(json){
		var parsed = JSON.parse(json);
		return net.run(parsed);
	});
}

function train(location, net) {
	var inputStream = fs.createReadStream(location, "utf8");
	var parsed = inputStream.pipe(ndjson.parse());
	var trainStream = net.createTrainStream();
	return eos(parsed.pipe(trainStream)).then(function () {
		return net;
	});
}
