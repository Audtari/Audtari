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
const MAX_BOUNCE_ANGLE = Math.PI / 4 // ball will bounce at an angle between PI/4 and 3*PI/4

const PADDLE_WIDTH = 100
const PADDLE_HEIGHT = PADDLE_WIDTH / 10

const BRICKS_PER_ROW = 7
const BRICKS_PER_COL = 7
const BRICK_WIDTH = (WIDTH - 10 * 2) / BRICKS_PER_ROW
const BRICK_HEIGHT = BRICK_WIDTH / 4

// global vars
let ball
let paddle
let bricks = []

let playerLives = 3 // player's starting lives
let hit = false // tracks brick collisions per cycle

let angle

export default class Breakout extends React.Component {
  setup(p5) {
    p5.createCanvas(WIDTH, HEIGHT)

    // instantiate ball
    ball = new Ball(WIDTH / 2, HEIGHT / 2, BALL_SIZE, p5)

    // instantiate paddle
    paddle = new Paddle(
      (WIDTH - PADDLE_WIDTH) / 2,
      HEIGHT - PADDLE_HEIGHT - 20,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      p5
    )

    // instantiate all bricks
    for (let i = 0; i < BRICKS_PER_ROW; i++) {
      for (let j = 0; j < BRICKS_PER_COL; j++) {
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

    // display and move ball
    ball.show()
    ball.update()

    // display and move paddle
    paddle.show()
    paddle.setX(p5.mouseX - PADDLE_WIDTH / 2)

    // display bricks
    bricks.forEach(brick => brick.show())

    // collision detection for bricks
    for (let i = 0; i < bricks.length; i++) {
      let inXRange =
        ball.getX() + BALL_SIZE / 2 >= bricks[i].getX() &&
        ball.getX() - BALL_SIZE / 2 <= bricks[i].getX() + bricks[i].getWidth()

      let inYRange =
        ball.getY() - BALL_SIZE / 2 <= bricks[i].getY() + BRICK_HEIGHT

      let leftSideX =
        ball.getX() + BALL_SIZE / 2 >= bricks[i].getX() &&
        ball.getX() + BALL_SIZE / 2 <= bricks[i].getX() + 5

      let leftSideY =
        ball.getY() <= bricks[i].getY() + BRICK_HEIGHT &&
        ball.getY() >= bricks[i].getY()

      let rightSideX =
        ball.getX() - BALL_SIZE / 2 <= bricks[i].getX() + BRICK_WIDTH &&
        ball.getX() + BALL_SIZE / 2 >= bricks[i].getX() + BRICK_WIDTH + 5

      // remove brick if hit and change x or y dir of ball (if a collision hasn't already been made this cycle)
      if (leftSideX && leftSideY) {
        bricks.splice(i, 1)
        if (!hit) ball.setX()
        hit = true
      } else if (inXRange && inYRange) {
        bricks.splice(i, 1)
        if (!hit) ball.setY()
        hit = true
      } else if (rightSideX && leftSideY) {
        bricks.splice(i, 1)
        if (!hit) ball.setX()
        hit = true
      }
    }

    hit = false

    // if the ball hits the left, right, or top of screen then bounce off
    // if it hits the bottom of the screen, we lose a life and reset the ball
    if (ball.getX() - BALL_SIZE / 2 <= 0) {
      ball.setX()
    } else if (ball.getX() + BALL_SIZE / 2 >= WIDTH) {
      ball.setX()
    } else if (ball.getY() - BALL_SIZE / 2 <= 0) {
      ball.setY()
    } else if (ball.getY() - BALL_SIZE / 2 >= HEIGHT) {
      ball.setPos(WIDTH / 2, HEIGHT / 2)
      // angle = p5.random(p5.PI / 4, (3 * p5.PI) / 4)
      // ball.setAngle(angle)
      playerLives--
    }

    // keeps track of if ball has passed the paddle
    let passed = ball.getY() + BALL_SIZE / 2 <= paddle.getY + 10

    let inXRange =
      ball.getX() + BALL_SIZE / 2 >= paddle.getX() &&
      ball.getX() - BALL_SIZE / 2 <= paddle.getX() + PADDLE_WIDTH

    let inYRange = ball.getY() + BALL_SIZE / 2 >= paddle.getY() - 5

    // bounce ball when it hits paddle
    if (inXRange && inYRange && !passed) {
      ball.setY()
      // bounce angle is relative to collision point
      let rel = paddle.getX() + PADDLE_WIDTH - ball.getX()
      rel = rel / PADDLE_WIDTH * 2 + 1
      angle = rel * MAX_BOUNCE_ANGLE

      ball.setSpeed()
      ball.setAngle(angle)
    }

    console.log(ball.getXSpeed(), ball.getYSpeed())
    // game over if player loses all lives
    if (playerLives == 0) {
      p5.textSize(100)
      p5.fill(255, 0, 0)
      p5.textAlign(p5.CENTER)

      p5.text('GAME OVER', 350, 420)
      p5.noLoop()
    }

    // game is won when no bricks are left
    if (!bricks.length) {
      p5.textSize(100)
      p5.fill(0, 255, 0)
      p5.textAlign(p5.CENTER)

      p5.text('YOU WIN!', 350, 420)
      p5.noLoop()
    }

    // score display
    p5.textSize(100)
    p5.fill(255)
    p5.textAlign(p5.CENTER)
    p5.text('Lives: ' + playerLives, WIDTH / 2, HEIGHT / 2)

    // bricks remaining display
    // p5.textSize(35)
    // p5.text('Bricks Remaining: ' + bricks.length, WIDTH / 2, (3 * HEIGHT) / 5)
  }

  render() {
    return (
      <div>
        <div />
        <Sketch setup={this.setup} draw={this.draw} />
      </div>
    )
  }
}
