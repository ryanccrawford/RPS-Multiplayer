//Initialize Firebase Database
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
var database = firebase.database();
var usersRef = database.ref('users');
var messagesRef =  database.ref('messages');
    

//objects Vars
var user = function (_userName) {
    return {
        userKey: null,
        userName: _userName,
        createdOntimeStamp: null,
        lastAccessed: null,
        isConnected: false,
        isPlayingGame: false,
        color: !(0X000000),
        isInGame: false,
        CurrentGameId: -1,
        currentOponentID: -1
    }
}

var gameOject = {
        isPlaying: false,
        gameKey: null,
        moveCount: 0,
        player1userKey: null,
        player1user: {},
        player2userKey: null,
        player2user: {},
        wins: 0,
        losses: 0,
        ties: 0,
        numberOfRoundsPlayed: 0,
        timeStarted: null,
        timeFinished: null,
        winner: null

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


var curentPlayers = []
var choices = ["r", "p", "s"]
var rockImg = '<img src="images/rock.png" width="350">';
var paperImg = '<img src="images/paper.png" width="350">';
var scissorImg = '<img src="images/scissors.png" width="350">';
var choiceSprite = [rockImg, paperImg, scissorImg],
    playerList = [],
    localuser,
    allUsers = [],
    timeOut,
    logoutTimer,
    isConnected = false,
    timerCount = 180,
    timer,
    thisPlayer,
    opponent,
    players = []
    isNewUserAdding = false

$(document).ready(function () {

    //if the move count changes in the database that means we have a move from a player
   
    database.ref('game').remove()
    database.ref('game').off()

    $('#connectedUsers').val('')
    $('#players').hide()
    $('#chat').hide()
   // $('#')
   // $('#')
    localuser = getLocalUserKey()
    database.ref().on('child_added', function (snap) {
        var data = snap.val()

    })
    
    $('#cleardata').click(cleardata)
    // Database on Change Functions
    //User Child Added
    database.ref('users').on("child_added", function (_userSnapshot) {
       

        var u = _userSnapshot.val();
        var k = _userSnapshot.key
        u.userKey = k
        if (isNewUserAdding) {
            isNewUserAdding = false
            setLocalUser(k)
            localuser = k
            players.push(u)
            database.ref('users/' + k + '/isConnected').on('value', function (snap) {

                 var data = snap.val()
                 if (data) {
                     $('#playGame').prop('disabled', 'false')
                 }

             })
            connect(u)
            return
        }
        if (k === localuser) {
            if (!players.includes(k)) {
                 players.push(u)
            }
            if ((!isConnected) && k === localuser) {
                connect(u)
            }
            showUsers();
            return
        }
        if (players.includes(k)) {
            showUsers();
            return
        }
        players.push(u)
        showUsers();

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code)
    });

    //Messages Child Added
    database.ref('messages').on("child_added", function (_messageSnapshot) {
        var message = _messageSnapshot.val()
        appendMessage(message.message)
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code)
    });

    database.ref('game').on('child_added',function(snap){
       
        var addedKeyPress= snap.val()
                
        if(addedKeyPress.userKey != localuser){
            gameOject.players2Guess = addedKeyPress.keyPressed
            gameOject.players2Gfx = choiceSprite[choices.indexOf(gameOject.players2Guess)];

    
                    if (isPlayerGuessValid(gameOject.players2Guess)) {

        
                       
       
                        $('#player2guess').html(gameOject.players2Gfx)


        
                        if (gameOject.players1Guess ==  gameOject.players2Guess) {

           
                            hideArea();
            
                            $('#messages').html("<h2>TIE</h2>");
            
                            showArea();
                            gameOject.numberOfRoundsPlayed++
                            gameOject.ties++

        
                        } else if (gameOject.players1Guess == 'p' && gameOject.players2Guess == 'r') {


         
                            hideArea();
           
                            playWinAnimation('player');
           
                            showArea();
           
                            playerWins();


       
                        } else if (gameOject.players1Guess == 'r' && gameOject.players2Guess == 's') {


           
                            hideArea();
            
                            playWinAnimation('player');
            
                            showArea();
           
                            playerWins();

        
                        } else if (gameOject.players1Guess == 's' && gameOject.players2Guess == 'p') {

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
    
            })

    // Button Click Functions
    //Create User
    $('#createUser').click(function (event) {
        event.preventDefault()
        createUser(this);

    })

    //Send Chat Message
    $('#send').click(function (event) {
        event.preventDefault()

        if ($('#message').val() != '') {
            var m = $('#message').val().trim()
            $('#message').val('')
            var mess = new message(localuser, timeStamp(), m)
            database.ref('messages').push(mess);
        }
    })



})


//-----------------------------------------------FUNCTIONS ----------------------------------------------------//
//messaging functions
function appendMessage(_message) {
    var li = $('<li>')
    $(li).text(_message)
    $('.lines').append(li)
}

function addMessage(_message, _userName) {
    var mess = new message(_userName, _message)
    mess.timeStamp = timeStamp()
    return messagesRef.push(mess).key;
}
function cleardata(){
    database.ref().remove();
}

//user functions
function updateUser(_update) {
    return database.ref().update(_update);
}

function updateLastAccessed(_userKey){
    var updatedinfo = {}
    updatedinfo['/users/' + _userKey + '/lastAccessed'] = timeStamp()
    updateUser(updatedinfo)
}

function clearConnections(_timeInterval){
 
    

}

function connect(_user) {
    $('#createUser').prop('disabled ', true)
    $('#step_1').hide()
    $('#genMessage').text('Hello ' + _user.userName)
    if (!isConnected) {
        _user.isConnected = true
        var updatedinfo = {}
        updatedinfo['/users/' + _user.userKey + '/isConnected'] = true
        updateUser(updatedinfo)
        isConnected = true
        
    }
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
    isNewUserAdding = true;
    var k = database.ref('users').push(u).key;
   
   

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
    var key = (typeof (localStorage.getItem('userId')) == 'undefined') ? '' : localStorage.getItem('userId')
    return key
}

//Display Functions
function showUsers() {
    var cn = $('#players-list')
    if (players.length > 0) {

        $(cn).empty()
        players.forEach(function (item) {
            
            if (item.userKey == localuser) {
                
            } else {
                 if ((item.userKey != localuser) && item.isConnected) {


                     var button = $('<button>')
                     $(button).text(item.userName)
                     $(button).attr("data-opponent", item.userKey)
                     $(button).click(function (event) {
                         event.preventDefault()
                         var opponent = $(this).attr('data-opponent')
                         $('#playGame').prop('disabled', false).attr('data-opponent', opponent).click(function (event) {
                             event.preventDefault()
                             playGame($('#playGame').attr('data-opponent'))
                         })
                     })
                     $(cn).append(button)
                 }
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
        updatedinfo['/users/' + _user.userkey + '/isConnected'] = true
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
    
    opponent = null
    opponent = _opponent
    reset() 
    $('#chat').show()
    $(document).keyup(checkKey)
}
function reset(){
    $('#players').hide()
    $('#playGame').hide()
    $('#connectedUsersDisplay').hide()
    $('#game').show()
    $('#game_area').show()
    var pl1 = getUser(localuser)
    var pl2 = getUser(opponent)
    gameOject.player1userKey = localuser
    gameOject.player2userKey = opponent
    gameOject.player1user = pl1
    gameOject.player2user = pl2
    gameOject.isPlaying = true
    gameOject.players1Guess = null
    gameOject.players2Guess = null
        gameOject.player1Gfx = null
        gameOject.player2Gfx = null
}

function checkKey(event) {

    if(gameOject.players1Guess === null){
    var keyp = event.key;
        if(isPlayerGuessValid(keyp)){
            gameOject.players1Guess = keyp
            gameOject.player1Gfx = choiceSprite[choices.indexOf(gameOject.players1Guess)]
            $('#player1guess').html(gameOject.players1Gfx)
            var keyobject = {userKey:gameOject.player1userKey, keyPressed: gameOject.players1Guess}
            database.ref('game').push(keyobject)
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

        $('#messages').html("")
        $('#messages').html("<h1>YOU WIN</h2>")

    } else {

        $('#messages').html("");
        $('#messages').html("<h1>YOU LOSE</h2>")

    }


}

function playerWins() {

    $('#player_wins_dispaly').text(gameOject.wins);

}

function computerWins() {

    $('computer_wins_display').text(gameOject.losses);

}

function isPlayerGuessValid(guess) {
    var guess = guess.toLowerCase().trim()
    $('#messages').empty()
    return (guess == "r" || guess == 's' || guess == 'p');
}



//database functions
function timeStamp() {
    return firebase.database.ServerValue.TIMESTAMP
}

function writePlayerInput(_userKey, _keyPressed, _gameKey, _moveCount) {

}


