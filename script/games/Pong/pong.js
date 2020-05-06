const paddleHeight = 80
const ballSize = 30
const paddleWidth = paddleHeight / 5
const paddleSideMargin = 10
const scoreSize = 75

let ballX, ballY
let dirx = 1
let diry = 1
let scoreright = 0
let scoreleft = 0

let passed = false

function setup() {
  createCanvas(600, 500)
  ballX = width / 2
  ballY = height / 2

  textSize(100)
}

function draw() {
  background(220)

  let lrect = rect(
    paddleSideMargin,
    mouseY - paddleHeight / 2,
    paddleWidth,
    paddleHeight
  )

  let rrect = rect(
    width - paddleSideMargin - paddleWidth,
    mouseY - paddleHeight / 2,
    paddleWidth,
    paddleHeight
  )

  // ball
  let ball = ellipse(ballX, ballY, ballSize)

  let rx = 5 * dirx
  let ry = 4 * diry

  ballX += rx
  ballY += ry

  if (
    ballX < ballSize / 2 + paddleSideMargin + paddleWidth - 2 ||
    ballX + ballSize / 2 > width - paddleSideMargin - paddleWidth + 2
  ) {
    passed = true
  }

  // award points if ball gets passed opponent's paddle
  // then reset ball to center

  if (ballX < ballSize / 2) {
    scoreright++
    ballY = width / 2
    ballX = width / 2
    passed = false
  } else if (ballX + ballSize / 2 > width) {
    scoreleft++
    ballY = width / 2
    ballX = width / 2
    passed = false
  }

  text(scoreleft, width / 4, 100)
  text(scoreright, width / 4 * 3 - scoreSize, 100)

  if (ballY + ballSize / 2 > height) {
    diry *= -1
  } else if (ballY < ballSize / 2) {
    diry *= -1
  }

  // ball is within the paddle's y values
  let paddleYRange =
    ballY + ballSize / 2 > mouseY - paddleHeight / 2 &&
    ballY - ballSize / 2 < mouseY + paddleHeight / 2

  // if ball hits left paddle bounce off
  if (
    ballX - ballSize / 2 < paddleWidth + paddleSideMargin &&
    paddleYRange &&
    !passed
  ) {
    dirx *= -1
  }

  // if ball hits right paddle bounce off
  if (
    ballX + ballSize / 2 > width - paddleWidth - paddleSideMargin &&
    paddleYRange &&
    !passed
  ) {
    dirx *= -1
  }

  if (scoreleft == 5) {
    textSize(50)
    text('Player 1 wins!', width / 2 - 150, height / 2)

    noLoop()
  } else if (scoreright == 5) {
    textSize(50)
    text('Player 2 wins!', width / 2 - 150, height / 2)

    noLoop()
  }
}

function playAgain() {
  scoreleft = 0
  scoreright = 0
  ballX = width / 2
  ballY = height / 2
  loop()
}
