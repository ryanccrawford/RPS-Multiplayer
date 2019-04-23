 
var localuser 
var allUsers = []
var timeOut
var logoutTimer
var isConnected = false
var timerCount = 180;
var timer
var thisPlayer 
var players = []
$(document).ready(function (){
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
            var mess = new message(localuser,timeStamp(),m)
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


function appendMessage(_message) {
    var li = $('<li>')
    var lli = $('<li>')
    $(li).text(_message)
    $('.lines').append(li).append(lli)
}
function connect(_user) {
    $('#createUser').prop('disabled ', true)
     $('#step_1').hide()
    $('#genMessage').text('Welcome back ' + _user.userName)
     timer = startTimer(_user)
}
function startTimer(_user) {
    if (!isConnected) {
        _user.isConnected = true
        var updatedinfo = {}
        updatedinfo['/users/' + _user.key + '/isConnected'] = true
        updateUser(updatedinfo)
        isConnected = true
        return setInterval(tick,1000)
    } 
}
function updateUser(_update) {
     return database.ref().update(_update);
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

function timeOutWaring() {
    logoutTimer = setTimeout(logOff,30000)
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
function addMessage(_message, _userName) {
    var mess = new message(_userName, _message)
    mess.timeStamp = timeStamp()
   return messagesRef.push(mess).key;
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
            $('#playGame').prop('disabled','false' )
        }

    })
    connect(u)
    
}
function deleteUser(_key) {
    database.ref('users/'+_key).remove()
}
function getUser(_key) {
    var p = database.ref('users/'+_key)
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

function sendMessage(_message) {


}

function showMessages() {


}

function showUsers() {
    var cn = $('#players-list')
    if(players.length > 0){
       
        $(cn).empty()
        players.forEach(function (item) {
            if(item.key != localuser){
            
           
            var button = $('<button>')
            $(button).text(item.userName)
            $(button).data("opponent", item.key)
            $(button).click(function(event){
                event.preventDefault()
                var opponent = $(this).data('opponent')
                $('#playGame').prop('disabled', false).data('opponent',opponent).click(function(event){
                    event.preventDefault()
                    playGame($('#playGame').data('opponent'))
                }
                ) 
            })
            $(cn).append(button)}
            
         })

        $('#players').show()
    }
}
function  playGame(_opponent){
alert("going to play game with Player 1: " + players[0].userName + " and Player 2: " + players[1].userName)
}
function showConnectedUsers() {


}
function userConnectionTimeOut(_userName) {


}