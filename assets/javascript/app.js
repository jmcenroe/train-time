$(document).ready(function() {

  // Initialize clock
  Clock();

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
    //create new variables to call childSnapshot of data from firebase
    var train = childSnapshot.val();
    var name = train.name;
    var destination = train.destination;
    var frequency = train.frequency;
    var time = train.time;
    var $arrival = $('<td>')
    var $remaining = $('<td>')

    function displayTrain () {
      //prepend all information for train data submitted by user
      var row = $('<tr>');
      row.append($('<td>').text(name));
      row.append($('<td>').text(destination));
      row.append($('<td>').text(frequency));
      row.append($arrival);
      row.append($remaining);
      $('#schedule').prepend(row);
      updateTrain();
    }

    function updateTrain () {
      var firstTrainConverted = moment(time, "hh:mm").subtract(1, "years");
      console.log(firstTrainConverted);

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
      $arrival.text(nextTrainArr)
      $remaining.text(nextTrainMin)
      console.log('Arrival Time: ' + nextTrainArr);
    }

    displayTrain();
    setInterval(function () {
      updateTrain();
    }, 1000);
  }, function(err) {
      console.log(err);
  });
});

function Clock () {
  function tick () {
    var currentTime = moment().format('hh:mm:ss');
    $('#currentTime').html('Current Time: ' + currentTime);
  }

  setInterval(tick, 1000); // Update Clock Every Second
  tick();
}
