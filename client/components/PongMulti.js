/* eslint-disable */
import React from 'react'
import Sketch from 'react-p5'
import '../../script/lib/p5.speech'
import p5 from 'p5'
import firebase from 'firebase'

//Firebase db connection

// const db = firebase.database()

// Constants
const BALL_SPEED = 1
const BALL_SIZE = 30

const PADDLE_SPEED = 2
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
let stayDictionary = ['stay', 'say', 'play', 'flay', 'grey']

// global vars
let ballX, ballY
let leftRecY
let angle = 1
let dy
let currentBallX, currentBallY

export default class PongMulti extends React.Component {
  constructor() {
    super()
    this.state = {
      hello: 7,
      playerOne: false,
      ballX: 250,
      ballY: 300,
      leftRecY: 300
    }
  }

  paddleSideMargin = 10
  dirx = 1
  diry = 1
  scoreright = 0
  scoreleft = 0
  passed = false

  componentDidMount() {
    let currentUrl = window.location.href
    let roomCode = currentUrl.split('/')[4]
    let currentUser = firebase.auth()
    let roomRef = firebase
      .database()
      .ref('Pong_Rooms/rooms/' + roomCode + '/users')
    let userObj
    console.log(roomRef, 'room Ref')
    roomRef.once('value', snap => {
      console.log(snap.val(), 'Snap val in the once method')
      userObj = snap.val()
    })
    console.log(userObj, 'userObj')
    console.log(currentUser, 'current User')
    // let checkForPlayersRef = firebase
    //   .database()
    //   .ref('Pong_Rooms/rooms/' + room + '/users')
  }

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
        leftDY = -PADDLE_SPEED
      } else if (downDictionary.indexOf(mostrecentword) !== -1) {
        leftDY = PADDLE_SPEED
      } else if (stayDictionary.indexOf(mostrecentword) !== -1) {
        leftDY = 0
      }
    }
    myRec.start()
  }

  draw = p5 => {
    p5.background(220)

    let rightRecY = ballY - PADDLE_HEIGHT / 2

    console.log(this.state.leftRecY, 'can we access state here?')
    // left side paddle
    this.state.leftRecY += dy
    p5.rect(
      this.paddleSideMargin,
      this.state.leftRecY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    )

    // if paddle off bottom screen
    if (this.state.leftRecY > p5.height - PADDLE_HEIGHT - 10) {
      // dy *= -1
      this.state.leftRecY = p5.height - 10 - PADDLE_HEIGHT
      dy = 0
    } else if (this.state.leftRecY < 10) {
      // dy *= -1
      this.state.leftRecY = 10
      dy = 0
    } else {
      this.state.leftRecY += dy
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
    const gameData = {
      ballX,
      ballY,
      leftRecY
    }

    console.log('are we getting to the update?', gameData)
    //Update the database with the new values
    firebase
      .database()
      .ref('/Pong')
      .update(gameData)

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

    let leftPaddleYRange = ballY > leftRecY && ballY < leftRecY + PADDLE_HEIGHT

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

  render() {
    const val = this.state.hello
    return (
      <div>
        <div>
          <h1>{val}</h1>
        </div>
        <Sketch setup={this.setup} draw={this.draw} />
        {/* <button type="button" onClick={playAgain}>
          play again
        </button> */}
      </div>
    )
  }
}
