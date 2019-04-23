    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBjJ_oHsxoGsPS7Nv1YJzdSZQ9s99QTIAc",
        authDomain: "rpsmp-7bc44.firebaseapp.com",
        databaseURL: "https://rpsmp-7bc44.firebaseio.com",
        projectId: "rpsmp-7bc44",
        storageBucket: "rpsmp-7bc44.appspot.com",
        messagingSenderId: "106300897679"
    };
firebase.initializeApp(config);

var database = firebase.database()
var usersRef = database.ref('users')
var messagesRef = database.ref('messages')


var user = function (_userName) {
    return {
        userName: _userName,
        createdOntimeStamp: null,
        isConnected: false
    }
}

var message = function (_userKey,_timeStamp,_message) {
    return {
        userKey: _userKey,
        createdOnStamp: _timeStamp,
        message: _message
    }
}


function timeStamp() {
    return firebase.database.ServerValue.TIMESTAMP
}



