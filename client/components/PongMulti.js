/* eslint-disable */
import React from 'react'
import Sketch from 'react-p5'
import '../../script/lib/p5.speech'
import p5 from 'p5'
import firebase from 'firebase'
import {Button} from '@material-ui/core'
import {Alert} from '@material-ui/lab'

// Constants
const BALL_SPEED = 2
const BALL_SIZE = 30

const PADDLE_SPEED = 2
const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = PADDLE_HEIGHT / 5
const PADDLE_SIDE_MARGIN = 10

const MAX_SCORE = 2

// Canvas dimensions
const WIDTH = 600
const HEIGHT = 500

const SCORE_TEXT_SIZE = 75

// Speech recognition set up
var myRec = new p5.SpeechRec()
myRec.continuous = true
myRec.interimResults = true
myRec.onEnd = myRec.start()

//Speech Recognition Dictionaries
let upDictionary = ['up', 'cup', 'sup', 'pup', 'yup']
let downDictionary = [
  'down',
  'round',
  'clown',
  'sound',
  'brown',
  'crown',
  'noun',
  'gown',
  'town',
  'around'
]
let stayDictionary = ['stay', 'say', 'play', 'flay', 'grey', 'stop']

// global vars
let scoreLeft = 0
let scoreRight = 0
let dirx = 1
let diry = 1
let dy = 0
let angle = 1
let ballX, ballY
let leftRecY, rightRecY

let timer = 300
let text
let roomCode = window.location.href.split('/')[4]

let currentUser
let player1, player2
let gameState, gameOver
let readyCheck1, readyCheck2

export default class PongMulti extends React.Component {
  componentDidMount() {
    let gameStateRef = firebase
      .database()
      .ref('Pong_Rooms/rooms/' + roomCode + '/gameState')
    gameStateRef.on('value', data => {
      gameState = data.val()
    })
    firebase
      .database()
      .ref('Pong_Rooms/rooms/' + roomCode + '/scores/player1Score')
      .once('value', data => {
        scoreLeft = data.val()
      })
    firebase
      .database()
      .ref('Pong_Rooms/rooms/' + roomCode + '/scores/player2Score')
      .once('value', data => {
        scoreRight = data.val()
      })
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        currentUser = user.uid
        firebase
          .database()
          .ref('Pong_Rooms/rooms/' + roomCode + '/users')
          .on('value', snap => {
            player1 = snap.val().player1
            player2 = snap.val().player2
          })
      }
    })
  }

  setup(p5, canvasParentRef) {
    p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef)
    ballX = WIDTH / 2
    ballY = HEIGHT / 2
    leftRecY = HEIGHT / 2 - PADDLE_HEIGHT / 2
    rightRecY = HEIGHT / 2 - PADDLE_HEIGHT / 2

    p5.textSize(100)

    myRec.onResult = () => {
      var mostrecentword = myRec.resultString.split(' ').pop()
      if (upDictionary.indexOf(mostrecentword) !== -1) {
        dy = -PADDLE_SPEED
      } else if (downDictionary.indexOf(mostrecentword) !== -1) {
        dy = PADDLE_SPEED
      } else if (stayDictionary.indexOf(mostrecentword) !== -1) {
        dy = 0
      }
    }

    // myRec.start()

    // p5.noLoop()
  }

  draw = p5 => {
    p5.background(220)
    // myRec.stop()
    // myRec.start()
    let readyRef = firebase
      .database()
      .ref('Pong_Rooms/rooms/' + roomCode + '/users')
    let ready
    readyRef.on('value', data => {
      ready = data.val()
    })
    if (gameState !== 'active') {
      p5.textSize(50)
      p5.text('Waiting for another player', 10, HEIGHT / 2)
      p5.textSize(100)
      timer = 300
    } else if (
      timer > 0 &&
      ready.player1Ready === true &&
      ready.player2Ready === true
    ) {
      p5.ellipse(ballX, ballY, BALL_SIZE)
      p5.rect(
        WIDTH - PADDLE_SIDE_MARGIN - PADDLE_WIDTH,
        rightRecY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      )
      p5.rect(PADDLE_SIDE_MARGIN, leftRecY, PADDLE_WIDTH, PADDLE_HEIGHT)
      if (timer % 60 == 0) {
        text = timer / 60
      }
      p5.text(text, WIDTH / 2 - 10, HEIGHT / 2)
      timer--
    } else if (ready.player1Ready === true && ready.player2Ready === true) {
      //Conditional rendering based on who is which player
      if (player1 === currentUser) {
        //Make a call to the database about rightRecY and it's location
        let rightRef = firebase
          .database()
          .ref('Pong_Rooms/rooms/' + roomCode + '/rightRecY')

        rightRef.on('value', data => {
          rightRecY = data.val()
        })
        leftRecY += dy
      } else if (player2 === currentUser) {
        let leftRef = firebase
          .database()
          .ref('Pong_Rooms/rooms/' + roomCode + '/leftRecY')

        leftRef.on('value', data => {
          leftRecY = data.val()
        })
        rightRecY += dy
      }

      // if paddle off bottom screen
      if (leftRecY > HEIGHT - PADDLE_HEIGHT - 10) {
        leftRecY = HEIGHT - 10 - PADDLE_HEIGHT
        dy = 0
      } else if (leftRecY < 10) {
        leftRecY = 10
        dy = 0
      } else {
        leftRecY += dy
      }

      // left side paddle
      p5.rect(PADDLE_SIDE_MARGIN, leftRecY, PADDLE_WIDTH, PADDLE_HEIGHT)

      // if paddle off bottom screen
      if (rightRecY > HEIGHT - PADDLE_HEIGHT - 10) {
        rightRecY = HEIGHT - 10 - PADDLE_HEIGHT
        dy = 0
      } else if (rightRecY < 10) {
        rightRecY = 10
        dy = 0
      } else {
        rightRecY += dy
      }

      // right side paddle
      p5.rect(
        WIDTH - PADDLE_SIDE_MARGIN - PADDLE_WIDTH,
        rightRecY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      )

      //Ball ref from database
      let ballXRef = firebase
        .database()
        .ref('Pong_Rooms/rooms/' + roomCode + '/ballX')
      let ballYRef = firebase
        .database()
        .ref('Pong_Rooms/rooms/' + roomCode + '/ballY')

      //Set the database value to the rendered ball
      ballXRef.on('value', data => {
        ballX = data.val()
      })

      ballYRef.on('value', data => {
        ballY = data.val()
      })

      // ball
      p5.ellipse(ballX, ballY, BALL_SIZE)

      // calculate ball bounce angle
      let rx = BALL_SPEED * dirx * p5.cos(angle)
      let ry = BALL_SPEED * diry * p5.sin(angle)

      // move ball at angle
      ballX += rx
      ballY += ry

      //Update the database with the new values
      let gameData
      if (player1 === currentUser) {
        gameData = {
          ballX,
          ballY,
          leftRecY
        }
        firebase
          .database()
          .ref('/Pong_Rooms/rooms/' + roomCode)
          .update(gameData)
      } else if (player2 === currentUser) {
        gameData = {
          rightRecY
        }
        firebase
          .database()
          .ref('/Pong_Rooms/rooms/' + roomCode)
          .update(gameData)
      }

      // award points if ball gets passed opponent's paddle
      // then reset ball to center
      let ballResetData
      if (ballX < BALL_SIZE / 2) {
        scoreRight++
        ballY = WIDTH / 2
        ballX = WIDTH / 2

        //Set the database value to the rendered score
        ballResetData = {
          ballX,
          ballY,
          scores: {
            player1Score: scoreLeft,
            player2Score: scoreRight
          }
        }
        firebase
          .database()
          .ref('/Pong_Rooms/rooms/' + roomCode)
          .update(ballResetData)
        firebase
          .database()
          .ref('Pong_Rooms/rooms/' + roomCode + '/scores/player1Score')
          .on('value', data => {
            scoreLeft = data.val()
          })
        firebase
          .database()
          .ref('Pong_Rooms/rooms/' + roomCode + '/scores/player2Score')
          .on('value', data => {
            scoreRight = data.val()
          })
        timer = 180
        angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
      } else if (ballX + BALL_SIZE / 2 > WIDTH) {
        scoreLeft++
        ballY = HEIGHT / 2
        ballX = WIDTH / 2

        //Set the database value to the rendered score
        ballResetData = {
          ballX,
          ballY,
          scores: {
            player1Score: scoreLeft,
            player2Score: scoreRight
          }
        }
        firebase
          .database()
          .ref('/Pong_Rooms/rooms/' + roomCode)
          .update(ballResetData)
        firebase
          .database()
          .ref('Pong_Rooms/rooms/' + roomCode + '/scores/player1Score')
          .on('value', data => {
            scoreLeft = data.val()
          })
        firebase
          .database()
          .ref('Pong_Rooms/rooms/' + roomCode + '/scores/player2Score')
          .on('value', data => {
            scoreRight = data.val()
          })
        timer = 180
        angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
      }

      // add score to canvas
      p5.text(scoreLeft, WIDTH / 4, 100)
      p5.text(scoreRight, WIDTH / 4 * 3 - SCORE_TEXT_SIZE, 100)

      // ball bounces off of top and bottom of screen
      if (ballY + BALL_SIZE / 2 > HEIGHT + 5) {
        diry *= -1
      } else if (ballY < BALL_SIZE / 2) {
        diry *= -1
      }

      let leftPaddleYRange =
        ballY > leftRecY && ballY < leftRecY + PADDLE_HEIGHT

      // if ball hits left paddle then bounce off
      if (
        ballX - BALL_SIZE / 2 < PADDLE_WIDTH + PADDLE_SIDE_MARGIN &&
        leftPaddleYRange
      ) {
        dirx *= -1
        angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
      }

      let rightPaddleYRange =
        ballY > rightRecY && ballY < rightRecY + PADDLE_HEIGHT

      // if ball hits right paddle then bounce off
      if (
        ballX + BALL_SIZE / 2 > WIDTH - PADDLE_WIDTH - PADDLE_SIDE_MARGIN &&
        rightPaddleYRange
      ) {
        dirx *= -1
        angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
      }

      // show end game screen
      if (scoreLeft == MAX_SCORE) {
        p5.textSize(50)
        p5.text('Player 1 wins!', WIDTH / 2 - 150, HEIGHT / 2)
        gameOver = true
        p5.noLoop()
        let gamesPlayedRef
        let goalsScoredRef
        let lossRef
        let winsRef

        if (player1 === currentUser) {
          let endRef = firebase
            .database()
            .ref('Users/' + firebase.auth().currentUser.displayName)
          let userKey
          endRef.on('value', data => {
            userKey = Object.keys(data.val())
          })
          let userStats = firebase
            .database()
            .ref(
              'Users/' +
                firebase.auth().currentUser.displayName +
                '/' +
                userKey[0]
            )
          userStats.on('value', function(data) {
            gamesPlayedRef = data.val().gamesPlayed
            gamesPlayedRef++
            goalsScoredRef = data.val().goalsScored
            goalsScoredRef += scoreLeft
            winsRef = data.val().wins
            winsRef++
          })
          let endGameData = {
            gamesPlayed: gamesPlayedRef,
            goalsScored: goalsScoredRef,
            wins: winsRef
          }
          userStats.update(endGameData)
        } else if (player2 === currentUser) {
          let endRef = firebase
            .database()
            .ref('Users/' + firebase.auth().currentUser.displayName)
          let userKey
          endRef.on('value', data => {
            userKey = Object.keys(data.val())
          })
          let userStats = firebase
            .database()
            .ref(
              'Users/' +
                firebase.auth().currentUser.displayName +
                '/' +
                userKey[0]
            )
          userStats.on('value', function(data) {
            gamesPlayedRef = data.val().gamesPlayed
            gamesPlayedRef++
            goalsScoredRef = data.val().goalsScored
            goalsScoredRef += scoreLeft
            lossRef = data.val().losses
            lossRef++
          })
          let endGameData = {
            gamesPlayed: gamesPlayedRef,
            goalsScored: goalsScoredRef,
            losses: lossRef
          }
          userStats.update(endGameData)
        }
      } else if (scoreRight == MAX_SCORE) {
        p5.textSize(50)
        p5.text('Player 2 wins!', WIDTH / 2 - 150, HEIGHT / 2)
        gameOver = true
        p5.noLoop()
        if (player2 === currentUser) {
          let endRef = firebase
            .database()
            .ref('Users/' + firebase.auth().currentUser.displayName)
          let userKey
          endRef.on('value', data => {
            userKey = Object.keys(data.val())
          })
          let userStats = firebase
            .database()
            .ref(
              'Users/' +
                firebase.auth().currentUser.displayName +
                '/' +
                userKey[0]
            )
          userStats.on('value', function(data) {
            gamesPlayedRef = data.val().gamesPlayed
            gamesPlayedRef++
            goalsScoredRef = data.val().goalsScored
            goalsScoredRef += scoreLeft
            winsRef = data.val().wins
            winsRef++
          })
          let endGameData = {
            gamesPlayed: gamesPlayedRef,
            goalsScored: goalsScoredRef,
            wins: winsRef
          }
          userStats.update(endGameData)
        } else if (player1 === currentUser) {
          let endRef = firebase
            .database()
            .ref('Users/' + firebase.auth().currentUser.displayName)
          let userKey
          endRef.on('value', data => {
            userKey = Object.keys(data.val())
          })
          let userStats = firebase
            .database()
            .ref(
              'Users/' +
                firebase.auth().currentUser.displayName +
                '/' +
                userKey[0]
            )
          userStats.on('value', function(data) {
            gamesPlayedRef = data.val().gamesPlayed
            gamesPlayedRef++
            goalsScoredRef = data.val().goalsScored
            goalsScoredRef += scoreLeft
            lossRef = data.val().losses
            lossRef++
          })
          let endGameData = {
            gamesPlayed: gamesPlayedRef,
            goalsScored: goalsScoredRef,
            losses: lossRef
          }
          userStats.update(endGameData)
        }
      }
    }
  }

  backToLobby() {
    window.location.href = `/lobby`
    let deleteRef = firebase.database().ref('Pong_Rooms/rooms/' + roomCode)
    if (gameOver) {
      deleteRef.remove()
    } else {
      let backToLobbyRef = firebase
        .database()
        .ref('Pong_Rooms/rooms/' + roomCode + '/users')
      let roomUpdate
      let emptyGameState
      let waitingGameState
      emptyGameState = {
        gameState: 'empty'
      }
      waitingGameState = {
        gameState: 'waiting'
      }
      if (player1 === currentUser && !player2) {
        deleteRef.remove()
      } else if (player1 === currentUser && player2) {
        roomUpdate = {
          player1: ''
        }
        backToLobbyRef.update(roomUpdate)
        deleteRef.update(waitingGameState)
      } else if (player2 === currentUser && !player1) {
        deleteRef.remove()
      } else if (player2 === currentUser && player1) {
        roomUpdate = {
          player2: ''
        }
        backToLobbyRef.update(roomUpdate)
        deleteRef.update(waitingGameState)
      }
    }
  }

  readyToPlay() {
    let checkForPlayersRef = firebase
      .database()
      .ref('Pong_Rooms/rooms/' + roomCode + '/users')
    if (currentUser === player1) {
      checkForPlayersRef.on('value', data => {
        readyCheck1 = data.val().player1Ready
        if (readyCheck1 === false) !readyCheck1
      })
      let updateData = {
        player1Ready: true
      }
      checkForPlayersRef.update(updateData)
    } else {
      checkForPlayersRef.on('value', data => {
        readyCheck2 = data.val().player2Ready
        if (readyCheck2 === false) !readyCheck2
      })
      let updateData = {
        player2Ready: true
      }
      checkForPlayersRef.update(updateData)
    }
    if (readyCheck1 === true && readyCheck2 === true) {
    }
  }

  render() {
    let left = player1 || ''
    let user = currentUser || ''
    return (
      <div className="component">
        <div id="multi">
          <div>
            {user === left ? (
              <span>You are the left paddle!</span>
            ) : (
              <span>You are the right paddle!</span>
            )}
          </div>
          <div>
            <h3>Control your paddle with your voice:</h3>
            <ul>
              <li>Say "Up" to move the paddle up</li>
              <li>Say "Down" to move the paddle down</li>
              <li>Say "Stay" to stop the paddle in place</li>
            </ul>
          </div>
          <div>
            <span>Wanna play with a friend? Send them this code: </span>
            <span>{roomCode}</span>
            <Button
              variant="contained"
              color="default"
              onClick={() => navigator.clipboard.writeText(roomCode)}
            >
              Copy code
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="default"
              onClick={() => this.readyToPlay()}
            >
              Ready Up!
            </Button>
            <Button
              variant="contained"
              color="default"
              onClick={() => this.backToLobby()}
            >
              Back to the Lobby
            </Button>
          </div>
          <Sketch
            mouseClicked={this.mouseClicked}
            setup={this.setup}
            draw={this.draw}
          />
        </div>
      </div>
    )
  }
}
