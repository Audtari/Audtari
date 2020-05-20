/*
Paddle Class!

The singular game paddle (a p5 rect object). 

Class Params:
  x       - x coord
  y       - y coord
  width   - rect width
  height  - rect height
*/
export default class Paddle {
  constructor(x, y, width, height, p5) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.p5 = p5 // needs p5 passed from sketch
  }

  // return x coord
  getX() {
    return this.x
  }

  // return y coord
  getY() {
    return this.y
  }

  // set the x coord
  setX(x) {
    this.x = x
  }

  // set the y coord
  setY(y) {
    this.y = y
  }

  // display paddle on canvas
  show() {
    this.p5.fill(255)
    this.p5.rect(this.x, this.y, this.width, this.height)
  }
}
