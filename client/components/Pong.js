import React from 'react'
import Sketch from 'react-p5'
import p5 from 'p5'

let ballX
let ballY

export default class Pong extends React.Component {
  paddleHeight = 80
  ballSize = 30
  paddleWidth = this.paddleHeight / 5
  paddleSideMargin = 10
  scoreSize = 75
  dirx = 1
  diry = 1
  scoreright = 0
  scoreleft = 0
  passed = false

  setup(p5, canvasParentRef) {
    p5.createCanvas(600, 500).parent(canvasParentRef)
    ballX = p5.width / 2
    ballY = p5.height / 2
    p5.textSize(100)
  }

  draw = p5 => {
    p5.background(220)

    let lrect = p5.rect(
      this.paddleSideMargin,
      p5.mouseY - this.paddleHeight / 2,
      this.paddleWidth,
      this.paddleHeight
    )

    let rrect = p5.rect(
      p5.width - this.paddleSideMargin - this.paddleWidth,
      p5.mouseY - this.paddleHeight / 2,
      this.paddleWidth,
      this.paddleHeight
    )

    // ball
    let ball = p5.ellipse(ballX, ballY, this.ballSize)

    let rx = 5 * this.dirx
    let ry = 4 * this.diry

    ballX += rx
    ballY += ry

    if (
      ballX <
        this.ballSize / 2 + this.paddleSideMargin + this.paddleWidth - 2 ||
      ballX + this.ballSize / 2 >
        p5.width - this.paddleSideMargin - this.paddleWidth + 2
    ) {
      this.passed = true
    }

    // award points if ball gets passed opponent's paddle
    // then reset ball to center

    if (ballX < this.ballSize / 2) {
      this.scoreright++
      ballY = p5.width / 2
      ballX = p5.width / 2
      this.passed = false
    } else if (ballX + this.ballSize / 2 > p5.width) {
      this.scoreleft++
      ballY = p5.width / 2
      ballX = p5.width / 2
      this.passed = false
    }

    p5.text(this.scoreleft, p5.width / 4, 100)
    p5.text(this.scoreright, p5.width / 4 * 3 - this.scoreSize, 100)

    if (ballY + this.ballSize / 2 > p5.height) {
      this.diry *= -1
    } else if (ballY < this.ballSize / 2) {
      this.diry *= -1
    }

    // ball is within the paddle's y values
    let paddleYRange =
      ballY + this.ballSize / 2 > p5.mouseY - this.paddleHeight / 2 &&
      ballY - this.ballSize / 2 < p5.mouseY + this.paddleHeight / 2

    // if ball hits left paddle bounce off
    if (
      ballX - this.ballSize / 2 < this.paddleWidth + this.paddleSideMargin &&
      paddleYRange &&
      !this.passed
    ) {
      this.dirx *= -1
    }

    // if ball hits right paddle bounce off
    if (
      ballX + this.ballSize / 2 >
        p5.width - this.paddleWidth - this.paddleSideMargin &&
      paddleYRange &&
      !this.passed
    ) {
      this.dirx *= -1
    }

    if (this.scoreleft == 5) {
      p5.textSize(50)
      p5.text('Player 1 wins!', p5.width / 2 - 150, p5.height / 2)

      p5.noLoop()
    } else if (this.scoreright == 5) {
      p5.textSize(50)
      p5.text('Player 2 wins!', p5.width / 2 - 150, p5.height / 2)

      p5.noLoop()
    }
  }

  // playAgain() {
  //   this.scoreleft = 0
  //   this.scoreright = 0
  //   this.ballX = width / 2
  //   ballY = height / 2
  //   loop()
  // }

  render() {
    return (
      <div>
        <Sketch setup={this.setup} draw={this.draw} />
      </div>
    )
  }
}
