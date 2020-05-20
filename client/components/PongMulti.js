/* eslint-disable */
import React from 'react'
import Sketch from 'react-p5'
import '../../script/lib/p5.speech'
import p5 from 'p5'
import firebase from 'firebase'
import {Button} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
// import user from '../store/user'

//Firebase db connection

// const db = firebase.database()

// Constants
const BALL_SPEED = 3
const BALL_SIZE = 30

const PADDLE_SPEED = 2
const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = PADDLE_HEIGHT / 5
const PADDLE_SIDE_MARGIN = 10

const MAX_SCORE = 10

// Canvas dimensions
const WIDTH = 600
const HEIGHT = 500

const SCORE_TEXT_SIZE = 75

// Speech recognition set up
var myRec = new p5.SpeechRec()
myRec.continuous = true
myRec.interimResults = true

//Speech Recognition Dictionaries
let upDictionary = ['up', 'cup', 'sup', 'pup', 'sup', 'yup']
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
  'gown',
  'around'
]
let stayDictionary = ['stay', 'say', 'play', 'flay', 'grey', 'stop']

// global vars
let scoreLeft = 0
let scoreRight = 0
let dirx = 1
let diry = 1
let ballX, ballY
let leftRecY, rightRecY
let angle = 1
let dy
let timer = 300
let text
let roomCode = window.location.href.split('/')[4]

let currentUser
let player1, player2
let gameState

export default class PongMulti extends React.Component {
  constructor() {
    super()
    this.state = {
      hello: 7,
      play: false,
      gameOver: false,
      ballX: 250,
      ballY: 300
    }
    this.setup = this.setup.bind(this)
    // this.myRef = React.createRef()
    // this.copyToClipboard = this.copyToClipboard.bind(this)
    // this.mouseClicked = this.mouseClicked.bind(this)
    // let currentUrl = window.location.href
    // let roomCode = currentUrl.split('/')[4]
    // let currentUser = firebase.auth().onAuthStateChanged((user) => {
    //   console.log(user, "here's the user in the authState")
    //   if (user) {
    //   }
    // })
    // let roomRef = firebase
    //   .database()
    //   .ref('Pong_Rooms/rooms/' + roomCode + '/users')
    // let userObj
    // console.log(roomRef, 'room Ref')
    // roomRef.once('value', (snap) => {
    //   console.log(snap.val(), 'Snap val in the once method')
    //   userObj = snap.val()
    // })
    // console.log(userObj, 'userObj')
    // console.log(currentUser, 'current User')
  }

  passed = false
  // userRef = firebase
  //   .database()
  //   .ref('Pong_Rooms/rooms/' + this.roomCode + '/users')
  scoreRef = firebase.database().ref('Pong_Rooms/rooms/' + roomCode + '/scores')

  componentDidMount() {
    let gameStateRef = firebase
      .database()
      .ref('Pong_Rooms/rooms/' + roomCode + '/gameState')
    gameStateRef.on('value', data => {
      // this.setState({gameState: data.val()})
      gameState = data.val()
    })
  }

  setup(p5, canvasParentRef) {
    p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef)
    ballX = p5.width / 2
    ballY = p5.height / 2
    leftRecY = p5.height / 2 - PADDLE_HEIGHT / 2
    rightRecY = p5.height / 2 - PADDLE_HEIGHT / 2
    dy = 0

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

    myRec.start()

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

    // p5.noLoop()
  }

  draw = p5 => {
    p5.background(220)
    // this.state.play = false
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     this.currentUser = user.uid
    //     let userObj
    //     this.userRef.on('value', (snap) => {
    //       userObj = snap.val()
    //     })
    //     console.log(userObj, 'userObj')
    //     console.log(this.currentUser, 'current User')

    if (gameState !== 'active') {
      p5.text('Waiting for another player', 10, p5.height / 2)
    } else if (timer > 0) {
      if (timer % 60 == 0) {
        text = timer / 60
      }
      p5.text(text, p5.width / 2, p5.height / 2)
      timer--
    } else {
      let gameData
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

      // let rightRecY = ballY - PADDLE_HEIGHT / 2

      // left side paddle
      p5.rect(PADDLE_SIDE_MARGIN, leftRecY, PADDLE_WIDTH, PADDLE_HEIGHT)

      // if paddle off bottom screen
      if (leftRecY > p5.height - PADDLE_HEIGHT - 10) {
        // dy *= -1
        leftRecY = p5.height - 10 - PADDLE_HEIGHT
        dy = 0
      } else if (leftRecY < 10) {
        // dy *= -1
        leftRecY = 10
        dy = 0
      } else {
        leftRecY += dy
      }

      // right side paddle
      p5.rect(
        p5.width - PADDLE_SIDE_MARGIN - PADDLE_WIDTH,
        rightRecY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      )

      // if paddle off bottom screen
      if (rightRecY > p5.height - PADDLE_HEIGHT - 10) {
        // dy *= -1
        rightRecY = p5.height - 10 - PADDLE_HEIGHT
        dy = 0
      } else if (rightRecY < 10) {
        // dy *= -1
        rightRecY = 10
        dy = 0
      } else {
        rightRecY += dy
      }

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

      let leftScoreRef = firebase
        .database()
        .ref('Pong_Rooms/rooms/' + roomCode + '/scores/player1Score')
      let rightScoreRef = firebase
        .database()
        .ref('Pong_Rooms/rooms/' + roomCode + '/scores/player2Score')

      leftScoreRef.on('value', data => {
        scoreLeft = data.val()
      })
      rightScoreRef.on('value', data => {
        scoreRight = data.val()
      })
      // ball
      p5.ellipse(ballX, ballY, BALL_SIZE)

      // calculate ball bounce angle
      let rx = BALL_SPEED * dirx * p5.cos(angle)
      let ry = BALL_SPEED * diry * p5.sin(angle)

      // move ball at angle
      ballX += rx
      ballY += ry

      //The values to be updated in Firebase
      // leftRecY = this.state.leftRecY
      // const gameData = {
      //   ballX,
      //   ballY,
      //   leftRecY,
      // }

      //Update the database with the new values
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
      let scoreLeftUpdate = scoreLeft
      let scoreRightUpdate = scoreRight
      // let databaseScore
      // this.scoreRef.once('value', (data) => {
      //   console.log(data.val(), 'data.val in score Ref')
      //   databaseScore = data.val()
      // })
      // this.scoreleft = databaseScore.scoreleft
      // this.scoreright = databaseScore.scoreright
      if (ballX < BALL_SIZE / 2) {
        scoreRight++
        ballY = p5.width / 2
        ballX = p5.width / 2
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
        this.passed = false
        angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
      } else if (ballX + BALL_SIZE / 2 > p5.width) {
        scoreLeft++
        ballY = p5.width / 2
        ballX = p5.width / 2
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
        this.passed = false
        angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
      }

      // add score to canvas
      p5.text(scoreLeft, p5.width / 4, 100)
      p5.text(scoreRight, p5.width / 4 * 3 - SCORE_TEXT_SIZE, 100)

      // ball bounces off of top and bottom of screen
      if (ballY + BALL_SIZE / 2 > p5.height + 5) {
        diry *= -1
      } else if (ballY < BALL_SIZE / 2) {
        diry *= -1
      }

      let leftPaddleYRange =
        ballY > leftRecY && ballY < leftRecY + PADDLE_HEIGHT

      // if ball hits left then paddle bounce off
      if (
        ballX - BALL_SIZE / 2 < PADDLE_WIDTH + PADDLE_SIDE_MARGIN &&
        leftPaddleYRange
      ) {
        dirx *= -1
        angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
      }

      let rightPaddleYRange =
        ballY + BALL_SIZE / 2 > rightRecY - PADDLE_HEIGHT / 2 &&
        ballY - BALL_SIZE / 2 < rightRecY + PADDLE_HEIGHT / 2

      // if ball hits right then paddle bounce off
      if (
        ballX + BALL_SIZE / 2 > p5.width - PADDLE_WIDTH - PADDLE_SIDE_MARGIN &&
        rightPaddleYRange
      ) {
        dirx *= -1
        angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
      }

      // show end game screen
      if (scoreLeft == MAX_SCORE) {
        p5.textSize(50)
        p5.text('Player 1 wins!', p5.width / 2 - 150, p5.height / 2)
        this.setState({
          play: false,
          gameOver: true
        })
        p5.noLoop()
      } else if (scoreRight == MAX_SCORE) {
        p5.textSize(50)
        p5.text('Player 2 wins!', p5.width / 2 - 150, p5.height / 2)
        this.setState({
          play: false,
          gameOver: true
        })
        p5.noLoop()
      }
    }
  }

  // mouseClicked(p5) {
  //   this.setState({
  //     play: true,
  //   })
  //   p5.loop()
  // }

  backToLobby() {
    window.location.href = `/lobby`
    let deleteRef = firebase.database().ref('Pong_Rooms/rooms/' + roomCode)
    if (this.state.gameOver === true) {
      deleteRef.remove()
    } else {
      //  else if(this.state.gameOver === true && this.userObj.player1.length > 0 || this.userObj.player2.length > 0){
      // }
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
        roomUpdate = {
          player1: 'user1'
        }
        backToLobbyRef.update(roomUpdate)
        deleteRef.update(emptyGameState)
      } else if (player1 === currentUser && player2) {
        roomUpdate = {
          player1: 'user1'
        }
        backToLobbyRef.update(roomUpdate)
        deleteRef.update(waitingGameState)
      } else if (player2 === currentUser && !player1) {
        roomUpdate = {
          player2: 'user1'
        }
        backToLobbyRef.update(roomUpdate)
        deleteRef.update(emptyGameState)
      } else if (player2 === currentUser && player1) {
        roomUpdate = {
          player2: 'user1'
        }
        backToLobbyRef.update(roomUpdate)
        deleteRef.update(waitingGameState)
      }
    }
  }

  // copyToClipboard(roomCode) {
  //   navigator.clipboard.writeText(roomCode)
  // }

  render() {
    // const val = this.state.hello
    // let userData
    // this.userRef.on('value', function (data) {
    //   userData = data.val().player1
    // })
    let left = player1 || ''
    let user = currentUser || ''
    return (
      <div>
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
          <Button onClick={() => navigator.clipboard.writeText(roomCode)}>
            Copy code
          </Button>
        </div>
        <Sketch
          mouseClicked={this.mouseClicked}
          setup={this.setup}
          draw={this.draw}
        />
        <Button variant="outlined" onClick={() => this.backToLobby()}>
          Back to the Lobby
        </Button>
      </div>
    )
  }
}
