// Initialize Firebase Database
var config = {
    apiKey: "AIzaSyBjJ_oHsxoGsPS7Nv1YJzdSZQ9s99QTIAc",
    authDomain: "rpsmp-7bc44.firebaseapp.com",
    databaseURL: "https://rpsmp-7bc44.firebaseio.com",
    projectId: "rpsmp-7bc44",
    storageBucket: "rpsmp-7bc44.appspot.com",
    messagingSenderId: "106300897679"
};
firebase.initializeApp(config);

//Create database references
var database = firebase.database()
var usersRef = database.ref('users')
var messagesRef = database.ref('messages')


//objects Vars
var user = function (_userName) {
    return {
        userKey: null,
        userName: _userName,
        createdOntimeStamp: null,
        isConnected: false,
        isPlayingGame: false,
        color: !(0X000000),
        isInGame: false,
        CurrentGameId: -1,
        currentOponentID: -1
    }
}

var gameOject = function () {
    return {
        gameKey: null,
        moveCount: 0,
        player1Key: null,
        player2Key: null,
        player1Wins: 0,
        player2Wins: 0,
        Player1Losses: 0,
        player2Losses: 0,
        player1Ties: 0,
        player2Ties: 0,
        numberOfRoundsPlayed: 0,
        timeStarted: null,
        timeFinished: null,
        winner: null
    }
}

var message = function (_userKey, _timeStamp, _message) {
    return {
        userKey: _userKey,
        createdOnStamp: _timeStamp,
        message: _message
    }
}

var playerTimer = function () {
    return {
        playTimeOut: 60,
        userKey: _userKey,
        tickInterval: 1000,
        timerRef:null,
        isRunning: false,
        createTimer: function (_userKey) {
            this.userKey = _userKey
        },
        startTimer: function () {
            this.timerRef = setInterval(this.ticktoc, this.tickInterval)
        },
        stopTimer: function () {
            this.isRunning = false
            this.playTimeOut = 60
            clearInterval(this.timerRef)
        },
        ticktoc: function () {
            if (this.isRunning) {
                if (this.playTimeOut != 0) {
                    this.playTimeOut--
                } else {
                   this.stopTimer()
                }
            }
        }


    }
}


var step = 1;
var player1 = new player(1);
var player2 = new player(2);
var curentPlayers = []
var choices = ["r", "p", "s"],
    computerScore = 0,
    playersScore = 0,
    player1Gfx,
    players2Gfx,
    ties = 0,
    playerName = '',
    rockImg = '<img src="images/rock.png" width="350">';
paperImg = '<img src="images/paper.png" width="350">';
scissorImg = '<img src="images/scissors.png" width="350">';
choiceSprite = [rockImg, paperImg, scissorImg]
playerList = [],
    localuser,
    allUsers = []
timeOut,
logoutTimer,
isConnected = false,
    timerCount = 180,
    timer,
    thisPlayer,
    players = []



$(document).ready(function () {

    //if the move count changes in the database that means we have a move from a player
    database.ref('playerinput/' + _gameKey + "/" + _moveCount).on("value_change", function (snap) {
        alert("Player Moved")

    })

    $('#connectedUsers').val('')
    $('#players').hide()
    localuser = getLocalUserKey()


    database.ref('users').on("child_added", function (_userSnapshot) {
        var k = _userSnapshot.key

        var u = _userSnapshot.val()
        u.key = k
        players.push(u)
        if ((!isConnected) && k === localuser) {
            connect(u)
        }
        showUsers();
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code)
    });


    $('#createUser').click(function (event) {
        event.preventDefault()
        createUser(this);

    })

    $('#send').click(function (event) {
        event.preventDefault()

        if ($('#message').val() != '') {
            var m = $('#message').val().trim()
            $('#message').val('')
            var mess = new message(localuser, timeStamp(), m)
            database.ref('messages').push(mess);
        }
    })

    messagesRef.on("child_added", function (_messageSnapshot) {
        var message = _messageSnapshot.val()
        appendMessage(message.message)
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code)
    });



})

//messaging functions
function appendMessage(_message) {
    var li = $('<li>')
    var lli = $('<li>')
    $(li).text(_message)
    $('.lines').append(li).append(lli)
}

function addMessage(_message, _userName) {
    var mess = new message(_userName, _message)
    mess.timeStamp = timeStamp()
    return messagesRef.push(mess).key;
}

//user functions
function updateUser(_update) {
    return database.ref().update(_update);
}

function connect(_user) {
    $('#createUser').prop('disabled ', true)
    $('#step_1').hide()
    $('#genMessage').text('Welcome back ' + _user.userName)
    timer = startTimer(_user)
}

function createUser(_thisRef) {
    if (!$(_thisRef).prop('disabled')) {
        $(_thisRef).prop('disabled', true)
        var userName = $('#userName').val().trim()
        $('#userName').val('')
        if (userName != '') {
            addUser(userName)
        }
    }
}

function logOff() {
    if (isConnected) {
        isConnected = false
        var key = getLocalUser()
        var updatedinfo = {}
        updatedinfo['/users/' + key + '/isConnected'] = false
        updateUser(updatedinfo)

    }
}

function addUser(_userName) {
    var u = new user(_userName)
    u.createdOntimeStamp = timeStamp()
    var k = database.ref('users').push(u).key;
    localStorage.clear()
    setLocalUser(k)
    localuser = k
    u.key = k
    database.ref('users/' + localuser + '/isConnected').on('value', function (snap) {

        var data = snap.val()
        if (data) {
            $('#playGame').prop('disabled', 'false')
        }

    })
    connect(u)

}

function deleteUser(_key) {
    database.ref('users/' + _key).remove()
}

function getUser(_key) {
    var p = database.ref('users/' + _key)
    console.log(p)
    return p
}

function setLocalUser(_key) {
    localStorage.setItem('userId', _key)
}

function getLocalUserKey() {
    var key = localStorage.getItem('userId')
    return key
}

//Display Functions
function showUsers() {
    var cn = $('#players-list')
    if (players.length > 0) {

        $(cn).empty()
        players.forEach(function (item) {
            if (item.key != localuser) {


                var button = $('<button>')
                $(button).text(item.userName)
                $(button).data("opponent", item.key)
                $(button).click(function (event) {
                    event.preventDefault()
                    var opponent = $(this).data('opponent')
                    $('#playGame').prop('disabled', false).data('opponent', opponent).click(function (event) {
                        event.preventDefault()
                        playGame($('#playGame').data('opponent'))
                    })
                })
                $(cn).append(button)
            }

        })

        $('#players').show()
    }
}

//Timer Functions
function startTimer(_user) {
    if (!isConnected) {
        _user.isConnected = true
        var updatedinfo = {}
        updatedinfo['/users/' + _user.key + '/isConnected'] = true
        updateUser(updatedinfo)
        isConnected = true
        return setInterval(tick, 1000)
    }
}

function tick() {
    timerCount--
    if (timerCount <= 0) {
        $('#timerDisplay').text('You have been loged out')
        clearInterval(timer)
        //timeOutWaring()
        logOff()
    } else {
        $('#timerDisplay').text(timerCount)
    }

}

function timeOutWaring() {
    logoutTimer = setTimeout(logOff, 30000)
}



//Game Functions
function playGame(_opponent) {
    alert("going to play game with Player 1: " + players[0].userName + " and Player 2: " + players[1].userName)
}

function checkKey(event) {
   
    var players1Guess, players2Guess;

    players1Guess = event.key;
    player1Gfx = choiceSprite[choices.indexOf(players1Guess)];
    players2Guess = choices[Math.floor(Math.random() * choices.length)];
    players2Gfx = choiceSprite[choices.indexOf(players2Guess)];

    if (isPlayerGuessValid(players1Guess)) {

        player1_guess_display.innerHTML = player1Gfx;
        player2_guess_dispaly.innerHTML = players2Gfx


        if (players1Guess == players2Guess) {

            hideArea();
            document.getElementById('messages').innerHTML = "<h2>TIE</h2>";
            showArea();
            ties_display.textContent = ++ties;

        } else if (players1Guess == 'p' && players2Guess == 'r') {


            hideArea();
            playWinAnimation('player');
            showArea();
            playerWins();


        } else if (players1Guess == 'r' && players2Guess == 's') {


            hideArea();
            playWinAnimation('player');
            showArea();
            playerWins();

        } else if (players1Guess == 's' && players2Guess == 'p') {

            hideArea();
            playWinAnimation('player');
            showArea();
            playerWins();

        } else {

            hideArea();
            playWinAnimation('computer');
            showArea();
            computerWins();

        }

    }

}

function hideArea() {

    $('#game_area').hide();

}

function showArea() {

    $('#game_area').show();
}

function playWinAnimation(who) {

    if (who == 'player') {

        document.getElementById('messages').innerHTML = "";
        document.getElementById('messages').innerHTML = "<h1>YOU WIN</h2>";

    } else {

        document.getElementById('messages').innerHTML = "";
        document.getElementById('messages').innerHTML = "<h1>YOU LOSE</h2>";

    }


}

function playerWins() {

    player_wins_dispaly.textContent = ++playersScore;

}

function computerWins() {

    computer_wins_display.textContent = ++computerScore;

}

function isPlayerGuessValid(guess) {
    guess = guess.toLowerCase().trim()
    $('#messages').empty()
    return (guess == "r" || guess == 's' || guess == 'p');
}



//database functions
function timeStamp() {
    return firebase.database.ServerValue.TIMESTAMP
}

function writePlayerInput(_userKey, _keyPressed, _gameKey, _moveCount) {

}

function readPlayerInput(_userKey, _gameKey, _moveCount) {
    database.ref('playerinput/' + _gameKey + "/" + _moveCount)
}