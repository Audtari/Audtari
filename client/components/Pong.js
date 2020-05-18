/* eslint-disable */
import React from 'react'
import Sketch from 'react-p5'
import '../../script/lib/p5.speech'
import p5 from 'p5'
// import * as tf from '@tensorflow/tfjs'

// const model = tf.sequential()
// model.add(tf.layers.dense({units: 256, inputShape: [8]})) //input is a 1x8
// model.add(tf.layers.dense({units: 512, inputShape: [256]}))
// model.add(tf.layers.dense({units: 256, inputShape: [512]}))
// model.add(tf.layers.dense({units: 3, inputShape: [256]})) //returns a 1x3
// const learningRate = 0.001
// const optimizer = tf.train.adam(learningRate)
// model.compile({loss: 'meanSquaredError', optimizer: optimizer})

// const model = tf.sequential()
// model.add(tf.layers.dense({units: 50, activation: 'relu', inputShape: [4]}))
// model.add(tf.layers.dense({units: 3, activation: 'softmax'}))

// model.compile({
//   loss: 'categoricalCrossentropy',
//   optimizer: 'sgd',
//   metrics: ['accuracy'],
// })

// const xs = tf.tensor2d([1, 2, 3, 4], [4, 1])
// const ys = tf.tensor2d([1, 3, 5, 7], [4, 1])
// model.fit(xs, ys, {epochs: 10}).then(() => {
//   console.log('PREDICT', model.predict(tf.tensor2d([5], [1, 1])))
// })

//AI training variable
let previous_data = null
let training_data = [[], [], []]
let last_data_object = null
let turn = 0
let grab_data = true
let flip_table = true
let data_xs
let index
let train = true
import firebase from 'firebase'

//Firebase db connection

// const db = firebase.database()

// Constants
const BALL_SPEED = 3
const BALL_SIZE = 30

const PADDLE_SPEED = 3
const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = PADDLE_HEIGHT / 5

const MAX_SCORE = 100

// Canvas dimensions
const WIDTH = 600
const HEIGHT = 500

const SCORE_TEXT_SIZE = 75

// Speech recognition set up
var myRec = new p5.SpeechRec()
myRec.continuous = true
myRec.interimResults = true

// global vars
let ballX, ballY
let leftRecY, rightRecY
let angle = 1
let leftDY, rightDY

let speechIsOn = false

//Speech Recognition Dictionaries
let upDictionary = ['up', 'cup', 'sup', 'pup', 'sup', 'yup']
let downDictionary = [
  'down',
  'round',
  'clown',
  'sound',
  'brown',
  'crown',
  'noun',
  'gown',
  'town',
  'gown',
  'around'
]
let stayDictionary = ['stay', 'say', 'play', 'flay', 'grey']

export default class Pong extends React.Component {
  constructor() {
    super()
    this.state = {
      hello: 7
    }
  }

  paddleSideMargin = 10
  dirx = 1
  diry = 1
  scoreright = 0
  scoreleft = 0
  passed = false

  componentDidMount() {
    const rootRef = firebase.database().ref()
    // const helloRef = rootRef.child('hello')
    console.log('helloRef in Mount', rootRef)
    rootRef.on('value', snap => {
      console.log(snap.val(), 'snapshot val data')
      this.setState({
        hello: snap.val().hello
      })
    })
  }

  setup(p5, canvasParentRef) {
    p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef)
    ballX = p5.width / 2
    ballY = p5.height / 2
    leftRecY = p5.height / 2 - PADDLE_HEIGHT / 2
    rightRecY = p5.height / 2 - PADDLE_HEIGHT / 2
    leftDY = 0
    rightDY = 0

    p5.textSize(100)

    myRec.onResult = () => {
      console.log(myRec)
      var mostrecentword = myRec.resultString.split(' ').pop()
      if (upDictionary.indexOf(mostrecentword) !== -1) {
        leftDY = -PADDLE_SPEED
      } else if (downDictionary.indexOf(mostrecentword) !== -1) {
        leftDY = PADDLE_SPEED
      } else if (stayDictionary.indexOf(mostrecentword) !== -1) {
        leftDY = 0
      }
    }

    if (!speechIsOn) {
      myRec.start()
      speechIsOn = true
    }

    myRec.onEnd = () => {
      speechIsOn = !speechIsOn
    }
  }

  draw = p5 => {
    p5.background(220)

    // left side paddle
    p5.rect(this.paddleSideMargin, leftRecY, PADDLE_WIDTH, PADDLE_HEIGHT)

    // if paddle off bottom screen
    if (leftRecY > p5.height - PADDLE_HEIGHT - 10) {
      leftRecY = p5.height - 10 - PADDLE_HEIGHT
      leftDY = 0
    } else if (leftRecY < 10) {
      leftRecY = 10
      leftDY = 0
    } else {
      leftRecY += leftDY
    }

    // right side paddle
    p5.rect(
      p5.width - this.paddleSideMargin - PADDLE_WIDTH,
      rightRecY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    )

    if (grab_data) {
      // If this is the very first frame (no prior data):
      if (previous_data == null) {
        let data
        if (flip_table) {
          data = [
            p5.height - rightRecY,
            p5.height - leftRecY,
            p5.height - ballY,
            p5.height - ballY
          ]
        } else {
          data = [leftRecY, rightRecY, ballX, ballY]
        }
        previous_data = data
      } else if (flip_table) {
        data_xs = [
          p5.height - rightRecY,
          p5.height - leftRecY,
          p5.height - ballY,
          p5.width - ballX
        ]
        if (p5.width - leftRecY > previous_data[1]) {
          index = 0
        } else if (p5.width - leftRecY == previous_data[1]) {
          index = 1
        } else {
          index = 2
        }
        last_data_object = [...previous_data, ...data_xs]
        training_data[index].push(last_data_object)
        previous_data = data_xs
      } else {
        data_xs = [leftRecY, rightRecY, ballX, ballY]
        if (leftRecY < previous_data[0]) {
          index = 0
        } else if (leftRecY == previous_data[0]) {
          index = 1
        } else {
          index = 2
        }
        last_data_object = [...previous_data, ...data_xs]
        training_data[index].push(last_data_object)
        previous_data = data_xs
      }
    }

    if (turn > 100000) {
      console.log('balancing')

      //shuffle attempt
      len = Math.min(
        training_data[0].length,
        training_data[1].length,
        training_data[2].length
      )
      if (!len) {
        console.log('nothing to train')
        return
      }
      data_xs = []
      data_ys = []
      for (i = 0; i < 3; i++) {
        data_xs.push(...training_data[i].slice(0, len))
        data_ys.push(
          ...Array(len).fill([i == 0 ? 1 : 0, i == 1 ? 1 : 0, i == 2 ? 1 : 0])
        )
      }

      console.log('training')
      const xs = tf.tensor(data_xs)
      const ys = tf.tensor(data_ys)
      ;(async function() {
        console.log('training2')
        let result = await model.fit(xs, ys)
        console.log(result)
      })()
      console.log('trained')
      train = false
    }

    if (!train) {
      console.log('predicting')
      if (this.last_data_object != null) {
        //use this.last_data_object for input data
        //do prediction here
        //return -1/0/1
        prediction = model.predict(tf.tensor([this.last_data_object]))
        rightDY = tf.argMax(prediction, 1).dataSync() - 1
      }
    } else {
      rightRecY = ballY
    }
    rightRecY += rightDY

    if (rightRecY > p5.height - PADDLE_HEIGHT - 10) {
      rightRecY = p5.height - 10 - PADDLE_HEIGHT
      rightDY = 0
    } else if (rightRecY < 10) {
      rightRecY = 10
      rightDY = 0
    } else {
      rightRecY += rightDY
    }

    // ball
    p5.ellipse(ballX, ballY, BALL_SIZE)

    // calculate ball bounce angle
    let rx = BALL_SPEED * this.dirx * p5.cos(angle)
    let ry = BALL_SPEED * this.diry * p5.sin(angle)

    // move ball at angle
    ballX += rx
    ballY += ry

    // award points if ball gets passed opponent's paddle
    // then reset ball to center
    if (ballX < BALL_SIZE / 2) {
      this.scoreright++
      ballY = p5.width / 2
      ballX = p5.width / 2
      this.passed = false
      this.dirx *= -1
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    } else if (ballX + BALL_SIZE / 2 > p5.width) {
      this.scoreleft++
      ballY = p5.width / 2
      ballX = p5.width / 2
      this.passed = false
      this.dirx *= -1
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    }

    // add score to canvas
    p5.text(this.scoreleft, p5.width / 4, 100)
    p5.text(this.scoreright, p5.width / 4 * 3 - SCORE_TEXT_SIZE, 100)

    // ball bounces off of top and bottom of screen
    if (ballY + BALL_SIZE / 2 > p5.height + 5) {
      this.diry *= -1
    } else if (ballY < BALL_SIZE / 2) {
      this.diry *= -1
    }

    let leftPaddleYRange = ballY > leftRecY && ballY < leftRecY + PADDLE_HEIGHT

    // if ball hits left then paddle bounce off
    if (
      ballX - BALL_SIZE / 2 < PADDLE_WIDTH + this.paddleSideMargin &&
      leftPaddleYRange
    ) {
      this.dirx *= -1
      ballX += this.paddleSideMargin + PADDLE_WIDTH - BALL_SIZE / 2
      angle = p5.random(-1 * p5.HALF_PI / 4, p5.HALF_PI / 4)
    }

    let rightPaddleYRange =
      ballY + BALL_SIZE / 2 > rightRecY - PADDLE_HEIGHT / 2 &&
      ballY - BALL_SIZE / 2 < rightRecY + PADDLE_HEIGHT / 2

    // if ball hits right then paddle bounce off
    if (
      ballX + BALL_SIZE / 2 > p5.width - PADDLE_WIDTH - this.paddleSideMargin &&
      rightPaddleYRange
    ) {
      this.dirx *= -1
      ballX -= this.paddleSideMargin + PADDLE_WIDTH - BALL_SIZE / 2
      angle = p5.random(-1 * p5.HALF_PI / 2, p5.HALF_PI / 2)
    }

    // show end game screen
    if (this.scoreleft == MAX_SCORE) {
      p5.textSize(50)
      p5.text('Player 1 wins!', p5.width / 2 - 150, p5.height / 2)

      p5.noLoop()
    } else if (this.scoreright == MAX_SCORE) {
      p5.textSize(50)
      p5.text('Player 2 wins!', p5.width / 2 - 150, p5.height / 2)

      p5.noLoop()
    }

    // playAgain = () => {
    //   this.scoreleft = 0
    //   this.scoreright = 0
    //   this.ballX = this.width / 2
    //   this.ballY = this.height / 2
    //   p5.loop()
    // }
  }

  render() {
    const val = this.state.hello
    return (
      <div>
        <div>
          <h1>{val}</h1>
        </div>
        <Sketch setup={this.setup} draw={this.draw} />
        {/* <button type="button" onClick={playAgain}>
          play again
        </button> */}
      </div>
    )
  }
}
