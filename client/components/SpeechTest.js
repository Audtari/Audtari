import React, {Component} from 'react'
import Sketch from 'react-p5'
import p5, {SoundFile} from 'p5'
import '../../script/lib/p5.speech'
// import '../../script/lib/p5.sound'

var myRec = new p5.SpeechRec()
myRec.continuous = true
myRec.interimResults = true
var x, y
var dx, dy

// let mic, fft

// mic = new p5.AudioIn()
// fft = new p5.FFT()
export default class SpeechTest extends Component {
  setup(p) {
    p.createCanvas(710, 400)
    p.noFill()

    // mic = new p.AudioIn()
    // mic.start()
    // fft = new p.FFT()
    // fft.setInput(mic)
  }

  draw(p) {
    p.background(200)

    // let spectrum = fft.analyze()

    // p.beginShape()
    // for (i = 0; i < spectrum.length; i++) {
    //   vertex(i, map(spectrum[i], 0, 255, height, 0))
    // }
    // p.endShape()
  }

  render() {
    // console.log(myRec)
    return (
      <div>
        <Sketch setup={this.setup} draw={this.draw} />
      </div>
    )
  }
}
