/*
Brick Class!

bricks are p5 rec objects that are colored based on their y position.

Class Params:
  x       - x coord
  y       - y coord
  width   - rect width
  height  - rect height
*/
export default class Brick {
  constructor(x, y, width, height, p5) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.p5 = p5 // must be passed from setup function in sketch
  }

  // display a brick with appropriate color
  show() {
    if (this.y < 25) {
      this.p5.fill(255, 0, 0)
    } else if (this.y < 50) {
      this.p5.fill(255, 126, 0)
    } else if (this.y < 75) {
      this.p5.fill(255, 255, 0)
    } else if (this.y < 100) {
      this.p5.fill(0, 255, 0)
    } else if (this.y < 125) {
      this.p5.fill(0, 0, 255)
    } else if (this.y < 150) {
      this.p5.fill(126, 0, 255)
    } else if (this.y < 175) {
      this.p5.fill(255, 0, 255)
    }

    this.p5.strokeWeight(2)
    this.p5.rect(this.x, this.y, this.width, this.height)
  }

  // returns y coord
  getY() {
    return this.y
  }

  // returns x coord
  getX() {
    return this.x
  }

  // returns rect width
  getWidth() {
    return this.width
  }
}
