/* eslint-disable */
import React from 'react'
import Sketch from 'react-p5'
import '../../script/lib/p5.speech'
import p5 from 'p5'

// Constants
const BALL_SPEED = 3
const BALL_SIZE = 30

const PADDLE_SPEED = 3
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

// global vars
let ballX, ballY
let leftRecY
let angle = 1
let dy

export default class Pong extends React.Component {
  paddleSideMargin = 10
  dirx = 1
  diry = 1
  scoreright = 0
  scoreleft = 0
  passed = false

  setup(p5, canvasParentRef) {
    p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef)
    ballX = p5.width / 2
    ballY = p5.height / 2
    leftRecY = p5.height / 2 - PADDLE_HEIGHT / 2
    dy = 0

    p5.textSize(100)

    myRec.onResult = () => {
      console.log(myRec)
      var mostrecentword = myRec.resultString.split(' ').pop()
      if (mostrecentword.indexOf('up') !== -1) {
        dy = -PADDLE_SPEED
      } else if (mostrecentword.indexOf('down') !== -1) {
        dy = PADDLE_SPEED
      } else if (mostrecentword.indexOf('stay') !== -1) {
        dy = 0
      }
    }
    myRec.start()
  }

  draw = p5 => {
    p5.background(220)

    let rightRecY = ballY - PADDLE_HEIGHT / 2

    // left side paddle
    p5.rect(this.paddleSideMargin, leftRecY, PADDLE_WIDTH, PADDLE_HEIGHT)

    // if paddle off bottom screen
    if (leftRecY > p5.height - PADDLE_HEIGHT - 10) {
      leftRecY = p5.height - 10 - PADDLE_HEIGHT
      dy = 0
    } else if (leftRecY < 10) {
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

    // award points if ball gets passed opponent's paddle
    // then reset ball to center
    if (ballX < BALL_SIZE / 2) {
      this.scoreright++
      ballY = p5.width / 2
      ballX = p5.width / 2
      this.passed = false
      this.dirx *= -1
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    } else if (ballX + BALL_SIZE / 2 > p5.width) {
      this.scoreleft++
      ballY = p5.width / 2
      ballX = p5.width / 2
      this.passed = false
      this.dirx *= -1
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
      ballX += this.paddleSideMargin + PADDLE_WIDTH - BALL_SIZE / 2
      angle = p5.random(-1 * p5.HALF_PI / 4, p5.HALF_PI / 4)
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
      ballX -= this.paddleSideMargin + PADDLE_WIDTH - BALL_SIZE / 2
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
    return (
      <div>
        <Sketch setup={this.setup} draw={this.draw} />
        {/* <button type="button" onClick={playAgain}>
          play again
        </button> */}
      </div>
    )
  }
}
