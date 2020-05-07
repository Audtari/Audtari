/* eslint-disable */
import React from 'react'
import Sketch from 'react-p5'

let ballX
let ballY
let angle = 1
const MAX_SCORE = 1

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

    let leftRecY = p5.mouseY - this.paddleHeight / 2
    let rightRecY = ballY - this.paddleHeight / 2

    if (p5.mouseY > p5.height - this.paddleHeight / 2) {
      leftRecY = p5.height - this.paddleHeight - 10
    } else if (p5.mouseY < this.paddleHeight / 2) {
      leftRecY = 10
    }

    if (ballY + this.ballSize / 2 > p5.height - this.paddleHeight / 2) {
      rightRecY = p5.height - this.paddleHeight - 10
    } else if (ballY - this.ballSize / 2 < this.paddleHeight / 2) {
      rightRecY = 10
    }

    p5.rect(
      this.paddleSideMargin,
      leftRecY,
      this.paddleWidth,
      this.paddleHeight
    )

    p5.rect(
      p5.width - this.paddleSideMargin - this.paddleWidth,
      rightRecY,
      this.paddleWidth,
      this.paddleHeight
    )

    // ball
    p5.ellipse(ballX, ballY, this.ballSize)

    let rx = 5 * this.dirx * p5.cos(angle)
    let ry = 5 * this.diry * p5.sin(angle)

    ballX += rx
    ballY += ry

    // award points if ball gets passed opponent's paddle
    // then reset ball to center

    if (ballX < this.ballSize / 2) {
      this.scoreright++
      ballY = p5.width / 2
      ballX = p5.width / 2
      this.passed = false
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    } else if (ballX + this.ballSize / 2 > p5.width) {
      this.scoreleft++
      ballY = p5.width / 2
      ballX = p5.width / 2
      this.passed = false
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    }

    p5.text(this.scoreleft, p5.width / 4, 100)
    p5.text(this.scoreright, p5.width / 4 * 3 - this.scoreSize, 100)

    if (ballY + this.ballSize / 2 > p5.height + 5) {
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
      ballX - this.ballSize / 2 >
        this.paddleWidth + this.paddleSideMargin - 6.5 &&
      paddleYRange
    ) {
      this.dirx *= -1
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    }

    let p =
      ballY + this.ballSize / 2 > rightRecY - this.paddleHeight / 2 &&
      ballY - this.ballSize / 2 < rightRecY + this.paddleHeight / 2

    // if ball hits right paddle bounce off
    if (
      ballX + this.ballSize / 2 >
        p5.width - this.paddleWidth - this.paddleSideMargin &&
      ballX + this.ballSize / 2 <
        p5.width - this.paddleWidth - this.paddleSideMargin + 6.5 &&
      p
    ) {
      this.dirx *= -1
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    }

    if (this.scoreleft == MAX_SCORE) {
      p5.textSize(50)
      p5.text('Player 1 wins!', p5.width / 2 - 150, p5.height / 2)

      p5.noLoop()
    } else if (this.scoreright == MAX_SCORE) {
      p5.textSize(50)
      p5.text('Player 2 wins!', p5.width / 2 - 150, p5.height / 2)

      p5.noLoop()
    }
  }

  // playAgain = () => {
  //   this.scoreleft = 0
  //   this.scoreright = 0
  //   this.ballX = this.width / 2
  //   this.ballY = this.height / 2
  //   p5.loop()
  // }

  render() {
    return (
      <div>
        <Sketch setup={this.setup} draw={this.draw} />
        {/* <button type="button" onClick={this.playAgain()}>
          play again
        </button> */}
      </div>
    )
  }
}
