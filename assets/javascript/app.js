$(document).ready(function() {

	// Initialize Firebase
	var config = {
	    apiKey: 'AIzaSyAOPG-PEqF4VtNoUgziUq2yEZmSa9z87PA',
	    authDomain: 'train-time-57f32.firebaseapp.com',
	    databaseURL: 'https://train-time-57f32.firebaseio.com',
	    projectId: 'train-time-57f32',
	    storageBucket: 'gtrain-time-57f32.appspot.com/',
	    messagingSenderId: '440278035187'
	};
	firebase.initializeApp(config);

	// create a variable to reference the database
	var dataRef = firebase.database();

	// on button click, store data
	$('#submit-btn').on('click', function(event){
		
		//don't refresh the page
	    event.preventDefault();

	    // storing and retrieving the most recent information
	    var name = $('#name').val().trim();
	    var destination = $('#destination').val().trim();
	    var firstTrain = $('#firstTrain').val().trim();
	    var frequency = $('#frequency').val().trim();

	    //clear input fields after submit
	    $('#name').val('');
	    $('#destination').val('');
	    $('#firstTrain').val('');
	    $('#frequency').val('');

	    //push data to add onto previous data
	    dataRef.ref().push({
	    	name:name,
	    	destination:destination,
	    	time:firstTrain,
	    	frequency:frequency
	    });
	});

	// watch firebase for changes
	dataRef.ref().on('child_added', function(childSnapshot) {
        console.log(childSnapshot.val());


        //create new variables to call childSnapshot of data from firebase
        var name = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var time = childSnapshot.val().time;
        var key = childSnapshot.key;

        var firstTrainConverted = moment(time, "hh:mm").subtract(1, "years");
        console.log(firstTrainConverted);

		//set a variable equal to the current time from moment.js
        var currentTime = moment();
        console.log('Current Time: ' + moment(currentTime).format('hh:mm'));

        //post current time to jumbotron
        $('#currentTime').html('Current Time: ' + moment(currentTime).format('hh:mm'));

        //find the difference between the first train time and the current time
        var timeDiff = moment().diff(moment(firstTrainConverted), 'minutes')
        console.log('Time Difference: ' + timeDiff);

        //find the time apart by finding the remainder of the time difference and the frequency - use modal to get whole remainder number

        var timeRemainder = timeDiff % frequency;
        console.log(timeRemainder);

        //find the minutes until the next train

        var nextTrainMin = frequency - timeRemainder;
        console.log('Minutes Till Train: ' + nextTrainMin);

        //find the time of the next train arrival

        var nextTrainAdd = moment().add(nextTrainMin, 'minutes');
        var nextTrainArr = moment(nextTrainAdd).format('hh:mm');
        console.log('Arrival Time: ' + nextTrainArr);

        //prepend all information for train data submitted by user

        $('#schedule').prepend('<tr><td>' + name + '</td><td>' + destination + 
        	'</td><td>' + frequency + '</td><td>' + nextTrainArr + '</td><td>' + 
        	nextTrainMin + '</td><td>' + '</td></tr>');

	    }, function(err) {
	        console.log(err);
	    });
});

