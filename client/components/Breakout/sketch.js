/* eslint-disable */

// libraries
import React from 'react'
import Sketch from 'react-p5'
import '../../../script/lib/p5.speech'

// classes
import Ball from './Ball'
import Paddle from './Paddle'
import Brick from './Brick'

// CONSTANTS
const WIDTH = 700
const HEIGHT = 650

const BALL_SIZE = 30

const PADDLE_WIDTH = 125
const PADDLE_HEIGHT = PADDLE_WIDTH / 6

const MAX_BOUNCE_ANGLE = Math.PI / 4

const BRICKS_PER_ROW = 7
const BRICK_WIDTH = (WIDTH - 10 * 2) / BRICKS_PER_ROW
const BRICK_HEIGHT = BRICK_WIDTH / 4

// global vars
let ball // game ball
let paddle

let playerLives = 3

let bricks = []

export default class Breakout extends React.Component {
  setup(p5, canvasParentRef) {
    p5.createCanvas(WIDTH, HEIGHT)

    ball = new Ball(WIDTH / 2, HEIGHT / 2, BALL_SIZE, p5)

    paddle = new Paddle(
      (WIDTH - PADDLE_WIDTH) / 2,
      HEIGHT - PADDLE_HEIGHT - 20,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      p5
    )

    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        bricks.push(
          new Brick(
            i * BRICK_WIDTH + 10,
            j * BRICK_HEIGHT + 10,
            BRICK_WIDTH,
            BRICK_HEIGHT,
            p5
          )
        )
      }
    }
  }

  draw = p5 => {
    p5.background(47)

    p5.strokeWeight(0)
    p5.fill(255)
    ball.show()
    ball.update()

    paddle.show()
    paddle.setX(p5.mouseX - PADDLE_WIDTH / 2)

    bricks.forEach(brick => brick.show())

    for (let i = 0; i < bricks.length; i++) {
      let inXRange =
        ball.getX() + BRICK_WIDTH / 2 >= bricks[i].getX() &&
        ball.getX() - BRICK_WIDTH / 2 <= bricks[i].getX() + bricks[i].getWidth()

      let inYRange = ball.getY() - 30 / 2 <= bricks[i].getY() + 25

      if (inXRange && inYRange) {
        console.log('hit', bricks[i].getX(), bricks[i].getY())
        ball.setY()
        bricks.splice(i, 1)
      }
    }

    if (ball.getX() - BALL_SIZE / 2 <= 0) {
      // if the ball hits the left, right, or top of screen then bounce off
      // if it hits the bottom of the screen, we lose a life
      ball.setX()
    } else if (ball.getX() + BALL_SIZE / 2 >= WIDTH) {
      ball.setX()
    } else if (ball.getY() - BALL_SIZE / 2 <= 0) {
      ball.setY()
    } else if (ball.getY() - BALL_SIZE / 2 >= HEIGHT) {
      ball.setY()
      playerLives--
    }

    let inXRange =
      ball.getX() + BALL_SIZE / 2 >= paddle.getX() &&
      ball.getX() - BALL_SIZE / 2 <= paddle.getX() + PADDLE_WIDTH

    let inYRange = ball.getY() + BALL_SIZE / 2 >= paddle.getY() - 5

    // bounce ball when it hits paddle
    if (inXRange && inYRange) {
      ball.setY()

      let rel = paddle.getX() + PADDLE_WIDTH - ball.getX()
      rel = rel / PADDLE_WIDTH * 2 + 1
      let angle = rel * MAX_BOUNCE_ANGLE

      if (rel > p5.HALF_PI) {
        ball.setX()
      }

      ball.setAngle(angle)
    }

    // game over if player loses all lives
    if (playerLives == 0) {
      p5.textSize(100)
      p5.fill(255, 0, 0)
      p5.textAlign(p5.CENTER)
      p5.text('GAME OVER', 350, 420)
      p5.noLoop()
    }

    if (!bricks.length) {
      p5.noLoop()

      p5.textSize(100)
      p5.fill(0, 255, 0)
      p5.textAlign(p5.CENTER)
      p5.text('YOU WIN!', 350, 420)
    }

    // score display
    p5.textSize(100)
    p5.fill(255)
    p5.textAlign(p5.CENTER)
    p5.text('Lives: ' + playerLives, WIDTH / 2, HEIGHT / 2)

    p5.textSize(35)
    p5.text('Bricks Left: ' + bricks.length, WIDTH / 2, 3 * HEIGHT / 5)
  }

  render() {
    return (
      <div>
        <div />
        <Sketch setup={this.setup} draw={this.draw} />
        {/* <button type="button" onClick={playAgain}>
          play again
        </button> */}
      </div>
    )
  }
}
