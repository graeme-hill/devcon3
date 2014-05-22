// fetch people and vessels with awkward synchronization
function test1() {
	var start = new Date();
	var people = null;
	var vessels = null;

	var onCompleted = function() {
		if (people != null && vessels != null) {
			prettyPrint(people, vessels, start);
		}
	};

	getJsonWithCallback('people.json', function(response) {
		people = response;
		onCompleted();
	});
	getJsonWithCallback('vessels.json', function(response) {
		vessels = response;
		onCompleted();
	});
}

// fetch people and vessels with easy synchronization
function test2() {
	var start = new Date();
	var peoplePromise = getJsonWithPromise('people.json');
	var vesselsPromise = getJsonWithPromise('vessels.json');

	$.when(peoplePromise, vesselsPromise).done(function(people, vessels) {
		prettyPrint(people, vessels, start);
	});
}

// do a thing that uses a lot of CPU
function test3() {
	cpuThing();
	cpuThing();
	cpuThing();
}

// use workers!
function test4() {
	new Worker('cpu_killer.js');
	new Worker('cpu_killer.js');
	new Worker('cpu_killer.js');
}

////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
////////////////////////////////////////////////////////////

function cpuThing() {
	console.log('started')
	var startDate = new Date();
	var start = 0;
	for (var i = 0; i < 400000000; i++) {
		start += Math.random();
	}
	var endDate = new Date();
	console.log('finished in this many millis: ' + (endDate - startDate));
}

function getJsonWithCallback(file, done) {
	$.ajax({
		url: file,
		success: done
	});
}

function getJsonWithPromise(file) {
	return $.ajax({
		url: file
	});
}

function prettyPrint(people, vessels, start) {
	var diff = (new Date()) - start;
	console.log("Got " + people.length + " people and " + vessels.length + " vessels in " + diff + " millis");
}