////////////////////////////////
///////// GAME LOGIC //////////
//////////////////////////////

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBapZKiZAE8wawo-RZcMT2400HSquSkz6g",
    authDomain: "trainscheduler-56400.firebaseapp.com",
    databaseURL: "https://trainscheduler-56400.firebaseio.com",
    projectId: "trainscheduler-56400",
    storageBucket: "trainscheduler-56400.appspot.com",
    messagingSenderId: "157968733380"
  };
  firebase.initializeApp(config);

// Initial Values
var database = firebase.database();

// Button for adding new trains from user
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Get user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm");
    var frequency = moment($("#freq-input").val().trim(), "mm");

    // Create local object for holding train data
    var newTrain = {
        TRAIN: trainName,
        DESTINATION: destination,
        FIRSTRAIN: firstTrain,
        FREQUENCY: frequency
    };

    // push the train data to Firebase
    database.ref().push(newTrain);
    
    // console log everything
    console.log(newTrain.TRAIN);
    console.log(newTrain.DESTINATION);
    console.log(newTrain.FIRSTRAIN);
    console.log(newTrain.FREQUENCY);

    alert("Train added successfully!");

    // clear all the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#freq-input").val("");
    
});

// Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSanpshot){
    console.log(childSanpshot.val());

    // store everything in a variable
    var trainName = childSanpshot.val().TRAIN;
    var destination = childSanpshot.val().DESTINATION;
    var firstTrain = childSanpshot.val().FIRSTRAIN;
    var frequency = childSanpshot.val().FREQUENCY;

    // train info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);

    // Frequency Assumptions
    var firstTime = firstTrain;
    var tFrequency = frequency;

    // convert the first time
    var firstTimeConverted = moment(firstTime, "HH:mm");
    console.log(firstTimeConverted)

    // Current Time
    var currentTime = moment();
    console.log("Current Time is: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(firstTimeConverted, "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // create the new row to DOM
    var newRow = $("<tr>").append( 
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain),
    );
});