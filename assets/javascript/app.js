$(document).ready(function() {

	// Initialize Firebase
	var config = {
    apiKey: "AIzaSyAOPG-PEqF4VtNoUgziUq2yEZmSa9z87PA",
    authDomain: "train-time-57f32.firebaseapp.com",
    databaseURL: "https://train-time-57f32.firebaseio.com",
    projectId: "train-time-57f32",
    storageBucket: "",
    messagingSenderId: "440278035187"
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

	    $("#name").val("");
	    $("#destination").val("");
	    $("#firstTrain").val("");
	    $("#frequency").val("");

	    //push data to add onto previous data

	    dataRef.ref().push({
	    	name:name,
	    	destination:destination,
	    	time:firstTrain,
	    	frequency:frequency
	    });
	});

	// watch firebase for changes
	dataRef.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());


        //create new variables to call childSnapshot of data from firebase

        var name = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var time = childSnapshot.val().time;
        var key = childSnapshot.key;

		//set a variable equal to the current time from moment.js

        var currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("hh:mm"));

        //post current time to jumbotron

        $("#currentTime").html("Current Time: " + moment(currentTime).format("hh:mm"));
        
    });