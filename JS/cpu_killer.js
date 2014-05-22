console.log('started')
var startDate = new Date();
var start = 0;
for (var i = 0; i < 400000000; i++) {
	start += Math.random();
}
var endDate = new Date();
console.log('finished in this many millis: ' + (endDate - startDate));