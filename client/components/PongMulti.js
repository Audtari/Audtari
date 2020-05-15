/* eslint-disable */
import React from 'react'
import Sketch from 'react-p5'
import '../../script/lib/p5.speech'
import p5 from 'p5'
import firebase from 'firebase'
// import user from '../store/user'

//Firebase db connection

// const db = firebase.database()

// Constants
const BALL_SPEED = 1
const BALL_SIZE = 30

const PADDLE_SPEED = 0.5
const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = PADDLE_HEIGHT / 5

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
let ballX, ballY
let leftRecY, rightRecY
let angle = 1
let dy
let currentBallX, currentBallY
let currentUrl, roomCode, userRef, currentUser, userObj

export default class PongMulti extends React.Component {
  constructor() {
    super()
    this.state = {
      hello: 7,
      play: false,
      ballX: 250,
      ballY: 300,
      leftRecY: 300
    }
    this.setup = this.setup.bind(this)
    this.mouseClicked = this.mouseClicked.bind(this)
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

  paddleSideMargin = 10
  dirx = 1
  diry = 1
  scoreright = 0
  scoreleft = 0
  passed = false
  currentUrl = window.location.href
  roomCode = this.currentUrl.split('/')[4]
  userRef = firebase
    .database()
    .ref('Pong_Rooms/rooms/' + this.roomCode + '/users')

  componentDidMount() {}

  setup(p5, canvasParentRef) {
    p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef)
    ballX = p5.width / 2
    ballY = p5.height / 2
    this.state.leftRecY = p5.height / 2 - PADDLE_HEIGHT / 2
    dy = 0

    p5.textSize(100)

    myRec.onResult = () => {
      console.log(myRec)
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
        this.currentUser = user.uid
        this.userRef.on('value', snap => {
          this.userObj = snap.val()
        })
        console.log(this.userObj, 'userObj')
        console.log(this.currentUser, 'current User')
      }
    })

    p5.noLoop()
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
    if (this.state.play === false) {
      return
    }
    let gameData
    //Conditional rendering based on who is which player

    if (this.userObj.player1 === this.currentUser) {
      //Make a call to the database about rightRecY and it's location
      let rightRef = firebase
        .database()
        .ref('Pong_Rooms/rooms/' + this.roomCode + '/rightRecY')

      rightRef.on('value', data => {
        console.log(
          data.val(),
          'are we grabbing the data right here in rightRef?'
        )
        rightRecY = data.val()
      })
      leftRecY += dy
    } else if (this.userObj.player2 === this.currentUser) {
      let leftRef = firebase
        .database()
        .ref('Pong_Rooms/rooms/' + this.roomCode + '/leftRecY')

      leftRef.on('value', data => {
        leftRecY = data.val()
      })
      rightRecY += dy

      gameData = {
        ballX,
        ballY,
        rightRecY
      }
    }

    // let rightRecY = ballY - PADDLE_HEIGHT / 2

    // left side paddle
    p5.rect(this.paddleSideMargin, leftRecY, PADDLE_WIDTH, PADDLE_HEIGHT)

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
      p5.width - this.paddleSideMargin - PADDLE_WIDTH,
      rightRecY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    )

    // ball
    p5.ellipse(ballX, ballY, BALL_SIZE)

    // calculate ball bounce angle
    let rx = BALL_SPEED * this.dirx * p5.cos(angle)
    let ry = BALL_SPEED * this.diry * p5.sin(angle)

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
    if (this.userObj.player1 === this.currentUser) {
      gameData = {
        ballX,
        ballY,
        leftRecY
      }
      firebase
        .database()
        .ref('/Pong_Rooms/rooms/' + this.roomCode)
        .update(gameData)
    } else if (this.userObj.player2 === this.currentUser) {
      gameData = {
        ballX,
        ballY,
        rightRecY
      }
      firebase
        .database()
        .ref('/Pong_Rooms/rooms/' + this.roomCode)
        .update(gameData)
    }
    // award points if ball gets passed opponent's paddle
    // then reset ball to center
    if (ballX < BALL_SIZE / 2) {
      this.scoreright++
      ballY = p5.width / 2
      ballX = p5.width / 2
      this.passed = false
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    } else if (ballX + BALL_SIZE / 2 > p5.width) {
      this.scoreleft++
      ballY = p5.width / 2
      ballX = p5.width / 2
      this.passed = false
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    }

    // add score to canvas
    p5.text(this.scoreleft, p5.width / 4, 100)
    p5.text(this.scoreright, p5.width / 4 * 3 - SCORE_TEXT_SIZE, 100)

    // ball bounces off of top and bottom of screen
    if (ballY + BALL_SIZE / 2 > p5.height + 5) {
      this.diry *= -1
    } else if (ballY < BALL_SIZE / 2) {
      this.diry *= -1
    }

    let leftPaddleYRange =
      ballY > this.state.leftRecY && ballY < this.state.leftRecY + PADDLE_HEIGHT

    // if ball hits left then paddle bounce off
    if (
      ballX - BALL_SIZE / 2 < PADDLE_WIDTH + this.paddleSideMargin &&
      leftPaddleYRange
    ) {
      this.dirx *= -1
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    }

    let rightPaddleYRange =
      ballY + BALL_SIZE / 2 > rightRecY - PADDLE_HEIGHT / 2 &&
      ballY - BALL_SIZE / 2 < rightRecY + PADDLE_HEIGHT / 2

    // if ball hits right then paddle bounce off
    if (
      ballX + BALL_SIZE / 2 > p5.width - PADDLE_WIDTH - this.paddleSideMargin &&
      rightPaddleYRange
    ) {
      this.dirx *= -1
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    }

    // show end game screen
    if (this.scoreleft == MAX_SCORE) {
      p5.textSize(50)
      p5.text('Player 1 wins!', p5.width / 2 - 150, p5.height / 2)

      p5.noLoop()
    } else if (this.scoreright == MAX_SCORE) {
      p5.textSize(50)
      p5.text('Player 2 wins!', p5.width / 2 - 150, p5.height / 2)

      p5.noLoop()
    }

    // playAgain = () => {
    //   this.scoreleft = 0
    //   this.scoreright = 0
    //   this.ballX = this.width / 2
    //   this.ballY = this.height / 2
    //   p5.loop()
    // }
  }

  mouseClicked(p5) {
    this.setState({
      play: true
    })
    p5.loop()
  }

  render() {
    const val = this.state.hello
    return (
      <div>
        <div>
          <h1>{val}</h1>
          <button type="button" onClick={() => this.mouseClicked()}>
            Start Game
          </button>
        </div>
        <Sketch
          mouseClicked={this.mouseClicked}
          setup={this.setup}
          draw={this.draw}
        />
        {/* <button type="button" onClick={playAgain}>
          play again
        </button> */}
      </div>
    )
  }
}
