export default class Paddle {
  constructor(x, y, width, height, p5) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.p5 = p5
  }

  getX() {
    return this.x
  }

  getY() {
    return this.y
  }

  setX(x) {
    this.x = x
  }

  setY(y) {
    this.y = y
  }

  show() {
    this.p5.fill(255)
    this.p5.rect(this.x, this.y, this.width, this.height)
  }
}
