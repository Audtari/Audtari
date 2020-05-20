let ballXspeed = 8
let ballYspeed = 8

export default class Ball {
  constructor(x, y, size, p5) {
    this.x = x
    this.y = y
    this.size = size
    this.angle = 1
    this.p5 = p5
  }

  getX() {
    return this.x
  }

  getY() {
    return this.y
  }

  setX() {
    ballXspeed *= -1
  }

  setY() {
    ballYspeed *= -1
  }

  update() {
    let dx = ballXspeed * this.p5.cos(this.angle)
    let dy = ballYspeed * this.p5.sin(this.angle)

    this.x += dx
    this.y += dy
  }

  setAngle(angle) {
    this.angle = angle
  }

  show() {
    this.p5.fill(255)
    this.p5.ellipse(this.x, this.y, this.size, this.size)
  }
}
