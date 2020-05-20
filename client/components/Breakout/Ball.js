/*
Ball Class!

The single game ball (a p5 ellipse object). The movement of the ball is determined 
by multiplying the ball's speed by the corresponding trig identity of an angle between PI/4 and 3*PI/4.

i.e. x = speed * cos(angle) and y = speed * sin(angle)

Class Params:
  x       - x coord
  y       - y coord
  size    - ball radius
*/

// # of pixels per frame that the balls x and y coordinates will change (i.e. the balls speed)
// Note: these are not constants bc their direction will change (i.e. *= -1)
let ballXspeed = 8
let ballYspeed = 8

export default class Ball {
  constructor(x, y, size, p5) {
    this.x = x
    this.y = y
    this.size = size

    this.angle = p5.random(p5.PI / 4, 3 * p5.PI / 4) // initial movement angle is random

    this.p5 = p5 // we need p5 from sketch
  }

  // return x coord
  getX() {
    return this.x
  }

  // return y coord
  getY() {
    return this.y
  }

  // change x dir
  setX() {
    ballXspeed *= -1
  }

  // change y dir
  setY() {
    ballYspeed *= -1
  }

  // set the ball's position
  setPos(x, y) {
    this.x = x
    this.y = y
  }

  // move the ball across the screen according to speed and movement angle
  update() {
    let dx = ballXspeed * this.p5.cos(this.angle)
    let dy = ballYspeed * this.p5.sin(this.angle)

    this.x += dx
    this.y += dy
  }

  // set movement angle
  setAngle(angle) {
    this.angle = angle
  }

  // display the ball on the canvas
  show() {
    this.p5.fill(255)
    this.p5.ellipse(this.x, this.y, this.size, this.size)
  }
}
