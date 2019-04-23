
var player = function (_id) {
    return {
        id: _id,
        name: '',
        color: !(0X000000),
        wins: [],
        loses: [],
        ties: [],
        isInGame: false,
        CurrentGameId: -1,
        currentOponentID: -1
    }
}
var step = 1;
var player1 = new player(1);
var player2 = new player(2);
var choices = ["r", "p", "s"],
    computerScore = 0,
    playersScore = 0,
    playerGfx,
    computerGfx,
    ties = 0,
    playerName = '',
rockImg = '<img src="images/rock.png" width="350">';
paperImg = '<img src="images/paper.png" width="350">';
scissorImg = '<img src="images/scissors.png" width="350">';
choiceSprite = [rockImg, paperImg, scissorImg]
playerList

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

$(document).ready(function () {

    showStep(step)

    database.ref().on('child_added', function () {
        


    })

    



 }
)

function showStep(_stepNumber) {
    $('#step_1').hide()
    $('#step_2').hide()
    $('#step_3').hide()
    $('#step_' + _stepNumber).show()
    $('#step_' + _stepNumber + 'next').click(function (event) {
        if (_stepNumbeme = $('#pname').val()
r === 1) {
            player1.na
        }
        if (_stepNumber === 2) {
            $("input[type='radio']").on('change',function () {
                var color = $("input[name='color']:checked").val()
                    var isRed = $('#red').is(':checked')
                    var isBlue = $('#blue').is(':checked')
                    if (isBlue) {
                        player1.color = 0X0000FF
                    }
                    if (isRed) {
                        player1.color = 0XFF0000
                    }
            })
        
         
        }
        

    })

}



   function checkKey(event) {
       document.getElementById('messages').innerHTML = "";
       var playersGuess, computerGuess;

       playersGuess = event.key;
       playerGfx = choiceSprite[choices.indexOf(playersGuess)];
       computerGuess = choices[Math.floor(Math.random() * choices.length)];
       computerGfx = choiceSprite[choices.indexOf(computerGuess)];

       if (isPlayerGuessValid(playersGuess)) {

           player_guess_display.innerHTML = playerGfx;
           computer_guess_dispaly.innerHTML = computerGfx


           if (playersGuess == computerGuess) {

               hideArea();
               document.getElementById('messages').innerHTML = "<h2>TIE</h2>";
               showArea();
               ties_display.textContent = ++ties;

           } else if (playersGuess == 'p' && computerGuess == 'r') {


               hideArea();
               playWinAnimation('player');
               showArea();
               playerWins();


           } else if (playersGuess == 'r' && computerGuess == 's') {


               hideArea();
               playWinAnimation('player');
               showArea();
               playerWins();

           } else if (playersGuess == 's' && computerGuess == 'p') {

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

   