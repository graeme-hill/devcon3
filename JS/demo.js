// fetch people and vessels the simple way
function test1() {
	var start = new Date();

	getJsonWithCallback('people.json', function(people) {
		getJsonWithCallback('vessels.json', function(vessels) {
			prettyPrint(people, vessels, start);
		});
	});
}

// fetch a lot of things the simple way
function test2() {
	var start = new Date();

	getJsonWithCallback('vessels.json?parameter=a', function(a) {
		getJsonWithCallback('vessels.json?parameter=b', function(a) {
			getJsonWithCallback('vessels.json?parameter=c', function(a) {
				getJsonWithCallback('vessels.json?parameter=d', function(a) {
					getJsonWithCallback('vessels.json?parameter=e', function(a) {
						var diff = (new Date()) - start;
						console.log('Did 5 API calls in ' + diff + ' millis');
					});
				});
			});
		});
	});
}

// fetch people and vessels with awkward synchronization
function test3() {
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
function test4() {
	var start = new Date();
	var peoplePromise = getJsonWithPromise('people.json');
	var vesselsPromise = getJsonWithPromise('vessels.json');

	$.when(peoplePromise, vesselsPromise).done(function(people, vessels) {
		prettyPrint(people, vessels, start);
	});
}

// an example with more API calls
function test5() {
	var start = new Date();

	var allThings = $.when(
		getJsonWithPromise('vessels.json?$parameter=a'),
		getJsonWithPromise('vessels.json?$parameter=b'),
		getJsonWithPromise('vessels.json?$parameter=c'),
		getJsonWithPromise('vessels.json?$parameter=d'),
		getJsonWithPromise('vessels.json?$parameter=e'));

	allThings.done(function(a, b, c, d, e, f) {
		var diff = (new Date()) - start;
		console.log('Did 5 API calls in ' + diff + ' millis');
	});
}

// do a thing that uses a lot of CPU
function test6() {
	cpuThing();
	cpuThing();
	cpuThing();
}

// use workers!
function test7() {
	new Worker('cpu_killer.js');
	new Worker('cpu_killer.js');
	new Worker('cpu_killer.js');
}

// just sleep
function test8() {
	var start = new Date();

	var allThings = $.when(
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000),
		sleep(1000), sleep(1000), sleep(1000), sleep(1000), sleep(1000));

	allThings.done(function() {
		var diff = (new Date()) - start;
		console.log('Did 100 sleeps in ' + diff + ' millis');
	});
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

function sleep(millis) {
	var deferred = new $.Deferred();
	setTimeout(function() {
		deferred.resolve();
	}, millis);
	return deferred.promise();
}