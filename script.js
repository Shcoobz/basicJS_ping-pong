// Constants
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 700;

const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 50;
const PADDLE_DIFF = 25;

const BALL_RADIUS = 5;
const BALL_START_X = CANVAS_WIDTH / 2;
const BALL_START_Y = CANVAS_HEIGHT / 2;

const INITIAL_SPEED_Y = -3;
const MAX_SPEED_Y = 5;
const MIN_SPEED_Y = -5;
const COMPUTER_SPEED_INCREMENT = 0.3;

const WINNING_SCORE = 7;
const PADDLE_MOVEMENT_INCREMENT = 2;
const CENTER_LINE_DASH = [4];

// Dynamic Variables
let paddleBottomX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
let paddleTopX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
let ballX = BALL_START_X;
let ballY = BALL_START_Y;
let speedY, speedX, trajectoryX, computerSpeed;
let playerScore = 0;
let computerScore = 0;
let playerMoved = false;
let paddleContact = false;
let isGameOver = true;
let isNewGame = true;

// Canvas and Gameplay Setup
const { body } = document;
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const screenWidth = window.screen.width;
const canvasPosition = screenWidth / 2 - CANVAS_WIDTH / 2;
const isMobile = window.matchMedia('(max-width: 600px)');
const gameOverEl = document.createElement('div');

// Adjust settings based on device
function adjustSettingsForMobile() {
  if (isMobile.matches) {
    speedY = -2;
    speedX = speedY;
    computerSpeed = 4;
  } else {
    speedY = -1;
    speedX = speedY;
    computerSpeed = 3;
  }
}

// Drawing functions
function renderBackground() {
  context.fillStyle = 'black';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function renderPlayerPaddle() {
  context.fillRect(paddleBottomX, CANVAS_HEIGHT - 20, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function renderComputerPaddle() {
  context.fillRect(paddleTopX, 10, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function renderPaddles() {
  context.fillStyle = 'white';
  renderPlayerPaddle();
  renderComputerPaddle();
}

function renderCenterLine() {
  context.beginPath();
  context.setLineDash(CENTER_LINE_DASH);
  context.moveTo(0, CANVAS_HEIGHT / 2);
  context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
  context.strokeStyle = 'grey';
  context.stroke();
}

function renderBall() {
  context.beginPath();
  context.arc(ballX, ballY, BALL_RADIUS, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();
}

function renderScore() {
  context.font = '32px Courier New';
  context.fillText(playerScore, 20, CANVAS_HEIGHT / 2 + 50);
  context.fillText(computerScore, 20, CANVAS_HEIGHT / 2 - 30);
}

function renderCanvas() {
  renderBackground();
  renderPaddles();
  renderCenterLine();
  renderBall();
  renderScore();
}

// Game Mechanics
function ballReset() {
  ballX = BALL_START_X;
  ballY = BALL_START_Y;
  speedY = INITIAL_SPEED_Y;
}

function ballMove() {
  ballY += -speedY;

  if (playerMoved && paddleContact) {
    ballX += speedX;
  }
}

function checkWallCollisions() {
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }

  if (ballX > CANVAS_WIDTH && speedX > 0) {
    speedX = -speedX;
  }
}

function increaseBallSpeedOnHit(isTopPaddle = false) {
  if (playerMoved) {
    if (isTopPaddle) {
      speedY += 1;
      if (speedY > MAX_SPEED_Y) {
        speedY = MAX_SPEED_Y;
      }
    } else {
      speedY -= 1;
      if (speedY < MIN_SPEED_Y) {
        speedY = MIN_SPEED_Y;
        computerSpeed = 6;
      }
    }
  }
}

function checkPlayerPaddleCollision() {
  if (ballY > CANVAS_HEIGHT - PADDLE_DIFF) {
    if (ballX > paddleBottomX && ballX < paddleBottomX + PADDLE_WIDTH) {
      paddleContact = true;
      increaseBallSpeedOnHit();
      speedY = -speedY;
      trajectoryX = ballX - (paddleBottomX + PADDLE_DIFF);
      speedX = trajectoryX * COMPUTER_SPEED_INCREMENT;
    } else if (ballY > CANVAS_HEIGHT) {
      ballReset();
      computerScore++;
    }
  }
}

function checkComputerPaddleCollision() {
  if (ballY < PADDLE_DIFF) {
    if (ballX > paddleTopX && ballX < paddleTopX + PADDLE_WIDTH) {
      increaseBallSpeedOnHit(true);
      speedY = -speedY;
    } else if (ballY < 0) {
      ballReset();
      playerScore++;
    }
  }
}

function checkPaddleCollisions() {
  checkPlayerPaddleCollision();
  checkComputerPaddleCollision();
}

function ballBoundaries() {
  checkWallCollisions();
  checkPaddleCollisions();
}

function computerAI() {
  let maxPaddleShift = 3 + Math.floor(computerScore / PADDLE_MOVEMENT_INCREMENT);

  if (playerMoved) {
    const targetPosition = ballX - PADDLE_DIFF;
    const currentCenter = paddleTopX + PADDLE_WIDTH / 2;

    let moveAmount =
      Math.sign(targetPosition - currentCenter) *
      Math.min(Math.abs(targetPosition - currentCenter), maxPaddleShift);

    paddleTopX += moveAmount;
    paddleTopX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleTopX));
  }
}

function showGameOverEl(winner) {
  canvas.hidden = true;
  gameOverEl.textContent = '';
  gameOverEl.classList.add('game-over-container');

  const title = document.createElement('h1');
  title.textContent = `${winner} Wins!`;

  const playAgainBtn = document.createElement('button');
  playAgainBtn.addEventListener('click', startGame);
  playAgainBtn.textContent = 'Play Again';

  gameOverEl.append(title, playAgainBtn);
  body.appendChild(gameOverEl);
}

function gameOver() {
  if (playerScore === WINNING_SCORE || computerScore === WINNING_SCORE) {
    isGameOver = true;
    const winner = playerScore === WINNING_SCORE ? 'Player' : 'Computer';
    showGameOverEl(winner);
  }
}

function animate() {
  renderCanvas();
  ballMove();
  ballBoundaries();
  computerAI();
  gameOver();

  if (!isGameOver) {
    window.requestAnimationFrame(animate);
  }
}

function resetGameState() {
  isGameOver = false;
  isNewGame = false;
  playerScore = 0;
  computerScore = 0;
}

function setupCanvas() {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  body.appendChild(canvas);

  adjustSettingsForMobile();
  ballReset();
  renderCanvas();
}

function setupEventListeners() {
  canvas.removeEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.style.cursor = 'none';
}

function handleMouseMove(e) {
  playerMoved = true;
  paddleBottomX = e.clientX - canvasPosition - PADDLE_DIFF;
  paddleBottomX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleBottomX));
}

function startGame() {
  if (isGameOver && !isNewGame) {
    body.removeChild(gameOverEl);
  }

  resetGameState();
  setupCanvas();
  animate();
  setupEventListeners();
}

// On Load
startGame();
