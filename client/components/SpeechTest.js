import React, {Component} from 'react'
import Sketch from 'react-p5'
import p5 from 'p5'
import '../../script/lib/p5.speech'

var myRec = new p5.SpeechRec()
myRec.continuous = true
myRec.interimResults = true
var x, y
var dx, dy

export default class SpeechTest extends Component {
  setup(p) {
    // graphics stuff:
    p.createCanvas(800, 600)
    p.background(255, 255, 255)
    p.fill(0, 0, 0, 255)
    x = p.width / 2
    y = p.height / 2
    dx = 0
    dy = 0

    // instructions:
    p.textSize(20)
    p.textAlign('left')
    p.text('draw: up, down, left, right, clear', 20, 20)

    myRec.onResult = () => {
      var mostrecentword = myRec.resultString.split(' ').pop()
      if (mostrecentword.indexOf('left') !== -1) {
        dx = -1
        dy = 0
      } else if (mostrecentword.indexOf('right') !== -1) {
        dx = 1
        dy = 0
      } else if (mostrecentword.indexOf('up') !== -1) {
        dx = 0
        dy = -1
      } else if (mostrecentword.indexOf('down') !== -1) {
        dx = 0
        dy = 1
      } else if (mostrecentword.indexOf('clear') !== -1) {
        p.background(255)
        console.log(mostrecentword)
      }
    } // now in the constructor
    myRec.start() // start engine
  }

  draw(p) {
    p.ellipse(x, y, 5, 5)
    x += dx
    y += dy
    if (x < 0) x = p.width
    if (y < 0) y = p.height
    if (x > p.width) x = 0
    if (y > p.height) y = 0
  }

  render() {
    console.log(myRec)
    return (
      <div>
        <Sketch setup={this.setup} draw={this.draw} />
      </div>
    )
  }
}
