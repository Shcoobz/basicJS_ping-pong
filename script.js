/**
 * The width of the canvas where the game is rendered.
 * @const {number} CANVAS_WIDTH - Width of the game canvas, set to 500 pixels.
 */
const CANVAS_WIDTH = 500;

/**
 * The height of the canvas where the game is rendered.
 * @const {number} CANVAS_HEIGHT - Height of the game canvas, set to 700 pixels.
 */
const CANVAS_HEIGHT = 700;

/**
 * Height of the paddles used in the game.
 * @const {number} PADDLE_HEIGHT - Height of each paddle, set to 10 pixels.
 */
const PADDLE_HEIGHT = 10;

/**
 * Width of the paddles used in the game.
 * @const {number} PADDLE_WIDTH - Width of each paddle, set to 50 pixels.
 */
const PADDLE_WIDTH = 50;

/**
 * The difference or margin from the edge used to determine paddle position.
 * @const {number} PADDLE_DIFF - Margin used for paddle positioning calculations, set to 25 pixels.
 */
const PADDLE_DIFF = 25;

/**
 * Radius of the ball used in the game.
 * @const {number} BALL_RADIUS - Radius of the ball, set to 5 pixels.
 */
const BALL_RADIUS = 5;

/**
 * The initial x-coordinate of the ball at the start of the game.
 * @const {number} BALL_START_X - Initial x-coordinate for the ball, calculated to start at the center of the canvas width.
 */
const BALL_START_X = CANVAS_WIDTH / 2;

/**
 * The initial y-coordinate of the ball at the start of the game.
 * @const {number} BALL_START_Y - Initial y-coordinate for the ball, calculated to start at the center of the canvas height.
 */
const BALL_START_Y = CANVAS_HEIGHT / 2;

/**
 * The initial vertical speed of the ball.
 * @const {number} INITIAL_SPEED_Y - Initial vertical speed of the ball, set to -3 to move upwards.
 */
const INITIAL_SPEED_Y = -3;

/**
 * The maximum vertical speed the ball can achieve.
 * @const {number} MAX_SPEED_Y - Maximum vertical speed of the ball, set to 5.
 */
const MAX_SPEED_Y = 5;

/**
 * The minimum vertical speed the ball can achieve.
 * @const {number} MIN_SPEED_Y - Minimum vertical speed of the ball, set to -5.
 */
const MIN_SPEED_Y = -5;

/**
 * The increment used for adjusting the computer paddle's movement.
 * @const {number} COMPUTER_SPEED_INCREMENT - Multiplier for calculating computer paddle's movement speed, set to 0.3.
 */
const COMPUTER_SPEED_INCREMENT = 0.3;

/**
 * The score required to win the game.
 * @const {number} WINNING_SCORE - Winning score for the game, set to 7.
 */
const WINNING_SCORE = 7;

/**
 * The scoring increment that affects computer paddle movement speed.
 * @const {number} PADDLE_MOVEMENT_INCREMENT - Increment for adjusting paddle speed, set to 2 points.
 */
const PADDLE_MOVEMENT_INCREMENT = 2;

/**
 * Style for the center line dash on the canvas.
 * @const {Array<number>} CENTER_LINE_DASH - Array describing the dash pattern for the center line, set to [4].
 */
const CENTER_LINE_DASH = [4];

/**
 * X-coordinate of the bottom player's paddle.
 * @var {number} paddleBottomX - Dynamic position of the bottom paddle, initialized based on canvas and paddle width.
 */
let paddleBottomX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;

/**
 * X-coordinate of the top computer's paddle.
 * @var {number} paddleTopX - Dynamic position of the top paddle, initialized similarly to paddleBottomX.
 */
let paddleTopX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;

/**
 * Current x-coordinate of the ball.
 * @var {number} ballX - Dynamic position of the ball on the x-axis, starts at BALL_START_X.
 */
let ballX = BALL_START_X;

/**
 * Current y-coordinate of the ball.
 * @var {number} ballY - Dynamic position of the ball on the y-axis, starts at BALL_START_Y.
 */
let ballY = BALL_START_Y;

/**
 * Current vertical speed of the ball.
 * @var {number} speedY - Dynamic vertical speed of the ball, can change throughout the game.
 */
let speedY;

/**
 * Current horizontal speed of the ball.
 * @var {number} speedX - Dynamic horizontal speed of the ball, changes based on game interactions.
 */
let speedX;

/**
 * Current trajectory offset of the ball from the center of the paddle upon contact.
 * @var {number} trajectoryX - Dynamic calculation used to determine the ball's new horizontal direction after hitting a paddle.
 */
let trajectoryX;

/**
 * Current speed of the computer's paddle.
 * @var {number} computerSpeed - Dynamic speed of the computer's paddle, adjusts based on the game state.
 */
let computerSpeed;

/**
 * Current score of the player.
 * @var {number} playerScore - Player's score, increments when scoring conditions are met.
 */
let playerScore = 0;

/**
 * Current score of the computer.
 * @var {number} computerScore - Computer's score, increments similarly to playerScore.
 */
let computerScore = 0;

/**
 * Flag indicating whether the player has moved the paddle.
 * @var {boolean} playerMoved - True if the player has moved their paddle; otherwise false.
 */
let playerMoved = false;

/**
 * Flag indicating whether the ball has made contact with any paddle.
 * @var {boolean} paddleContact - True if there is a collision between the ball and any paddle; otherwise false.
 */
let paddleContact = false;

/**
 * Flag indicating whether the game is over.
 * @var {boolean} isGameOver - True if the game has ended; otherwise false.
 */
let isGameOver = true;

/**
 * Flag indicating whether a new game can be started.
 * @var {boolean} isNewGame - True if starting a new game is allowed; otherwise false.
 */
let isNewGame = true;

/**
 * Reference to the body of the document, used for appending game elements.
 * @var {HTMLElement} body - The body element of the document.
 */
const { body } = document;

/**
 * The canvas element where the game is rendered.
 * @var {HTMLCanvasElement} canvas - The canvas element created for the game.
 */
const canvas = document.createElement('canvas');

/**
 * The 2D rendering context for the canvas, used for drawing game elements.
 * @var {CanvasRenderingContext2D} context - The 2D context of the canvas.
 */
const context = canvas.getContext('2d');

/**
 * The width of the screen, used to center the canvas.
 * @var {number} screenWidth - The width of the screen.
 */
const screenWidth = window.screen.width;

/**
 * Calculated position to center the canvas on the screen.
 * @var {number} canvasPosition - Calculated horizontal position for centering the canvas.
 */
const canvasPosition = screenWidth / 2 - CANVAS_WIDTH / 2;

/**
 * Media query object to detect if the device is mobile.
 * @var {MediaQueryList} isMobile - Media query list object that tracks whether the viewport width is 600px or less.
 */
const isMobile = window.matchMedia('(max-width: 600px)');

/**
 * The element displayed when the game is over.
 * @var {HTMLElement} gameOverEl - Container element for displaying game over messages and controls.
 */
const gameOverEl = document.createElement('div');

/**
 * Adjusts game settings based on whether the game is being viewed on a mobile device.
 * Adjusts the speed of the ball and the computer paddle based on the device's screen width.
 */
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

/**
 * Renders the game background.
 * Fills the canvas with a black color to set the background for other game elements.
 */
function renderBackground() {
  context.fillStyle = 'black';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * Renders the player's paddle at the bottom of the canvas.
 * Draws a white rectangle representing the player's paddle based on its current position.
 */
function renderPlayerPaddle() {
  context.fillRect(paddleBottomX, CANVAS_HEIGHT - 20, PADDLE_WIDTH, PADDLE_HEIGHT);
}

/**
 * Renders the computer's paddle at the top of the canvas.
 * Draws a white rectangle representing the computer's paddle based on its current position.
 */
function renderComputerPaddle() {
  context.fillRect(paddleTopX, 10, PADDLE_WIDTH, PADDLE_HEIGHT);
}

/**
 * Calls rendering functions for both the player and computer paddles.
 * Ensures both paddles are drawn in their current positions with the correct styling.
 */
function renderPaddles() {
  context.fillStyle = 'white';
  renderPlayerPaddle();
  renderComputerPaddle();
}

/**
 * Renders a dashed line at the center of the canvas.
 * Draws a gray dashed line horizontally across the middle of the canvas to divide the play area.
 */
function renderCenterLine() {
  context.beginPath();
  context.setLineDash(CENTER_LINE_DASH);
  context.moveTo(0, CANVAS_HEIGHT / 2);
  context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
  context.strokeStyle = 'grey';
  context.stroke();
}

/**
 * Renders the game ball.
 * Draws a white circle at the ball's current position, representing the game ball.
 */
function renderBall() {
  context.beginPath();
  context.arc(ballX, ballY, BALL_RADIUS, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();
}

/**
 * Renders the current scores of the player and the computer.
 * Displays the scores on the canvas, positioned accordingly to be visible during gameplay.
 */
function renderScore() {
  context.font = '32px Courier New';
  context.fillText(playerScore, 20, CANVAS_HEIGHT / 2 + 50);
  context.fillText(computerScore, 20, CANVAS_HEIGHT / 2 - 30);
}

/**
 * Central function to call all rendering functions for various elements of the game.
 * This function orchestrates the drawing of the background, paddles, center line, ball, and score.
 */
function renderCanvas() {
  renderBackground();
  renderPaddles();
  renderCenterLine();
  renderBall();
  renderScore();
}

/**
 * Resets the ball to the center of the canvas with an initial vertical speed.
 * Used typically after a point is scored to restart play from the center of the play area.
 */
function ballReset() {
  ballX = BALL_START_X;
  ballY = BALL_START_Y;
  speedY = INITIAL_SPEED_Y;
}

/**
 * Updates the position of the ball based on its current speeds.
 * Adjusts the ball's vertical and, conditionally, horizontal positions based on game interactions.
 */
function ballMove() {
  ballY += -speedY;

  if (playerMoved && paddleContact) {
    ballX += speedX;
  }
}

/**
 * Checks and handles collisions of the ball with the canvas walls.
 * Reflects the ball's horizontal direction if it hits the left or right edges of the canvas.
 */
function checkWallCollisions() {
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }

  if (ballX > CANVAS_WIDTH && speedX > 0) {
    speedX = -speedX;
  }
}

/**
 * Increases the speed of the ball after hitting a paddle based on game rules.
 * @param {boolean} isTopPaddle - True if the ball hit the computer's paddle, false if it hit the player's paddle.
 */
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

/**
 * Checks and handles collisions between the ball and the player's paddle.
 * Determines if a collision occurred, handles game scoring, and adjusts the ball's direction and speed.
 */
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

/**
 * Checks and handles collisions between the ball and the computer's paddle.
 * Similar to checkPlayerPaddleCollision, but for the computer's paddle at the top.
 */
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

/**
 * Aggregates collision checking for both player and computer paddles.
 * Centralizes the logic to check for any paddle collisions in one call within the game loop.
 */
function checkPaddleCollisions() {
  checkPlayerPaddleCollision();
  checkComputerPaddleCollision();
}

/**
 * Aggregates all functions that handle boundary checking and collisions.
 * Ensures that the game correctly responds to all boundary interactions within one central function call.
 */
function ballBoundaries() {
  checkWallCollisions();
  checkPaddleCollisions();
}

/**
 * Controls the movement of the computer's paddle based on the ball's position.
 * Uses simple AI to try to position the computer paddle in alignment with the ball to block it.
 */
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

/**
 * Displays the game over screen with options to restart the game.
 * @param {string} winner - The winner of the game, either 'Player' or 'Computer'.
 */
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

/**
 * Checks if the game should end based on the scores and sets up the game over display.
 * Determines if either player or computer has reached the winning score and triggers the end of the game.
 */
function gameOver() {
  if (playerScore === WINNING_SCORE || computerScore === WINNING_SCORE) {
    isGameOver = true;
    const winner = playerScore === WINNING_SCORE ? 'Player' : 'Computer';
    showGameOverEl(winner);
  }
}

/**
 * Animation loop that updates and renders the game state continually until the game is over.
 * Calls various game mechanics functions and re-renders the canvas to reflect the current game state.
 */
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

/**
 * Resets the game state to initial values for all game parameters and variables.
 * Prepares the game for a new session by resetting scores, game flags, and the ball position.
 */
function resetGameState() {
  isGameOver = false;
  isNewGame = false;
  playerScore = 0;
  computerScore = 0;
}

/**
 * Sets up the canvas properties and appends it to the document body.
 * Ensures the canvas is ready for drawing and game play begins from a consistent state.
 */
function setupCanvas() {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  body.appendChild(canvas);

  adjustSettingsForMobile();
  ballReset();
  renderCanvas();
}

/**
 * Sets up necessary event listeners for the game, specifically for mouse movements.
 * Ensures the player can control their paddle via mouse input, with appropriate adjustments to event handling.
 */
function setupEventListeners() {
  canvas.removeEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.style.cursor = 'none';
}

/**
 * Handles mouse movement events to control the player's paddle.
 * @param {MouseEvent} e - The mouse event that triggers this handler, used to calculate paddle position.
 */
function handleMouseMove(e) {
  playerMoved = true;
  paddleBottomX = e.clientX - canvasPosition - PADDLE_DIFF;
  paddleBottomX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleBottomX));
}

/**
 * Starts or restarts the game by setting initial states and setting up the environment.
 * Ensures the game is ready to be played, invoking setup functions and starting the animation loop.
 */
function startGame() {
  if (isGameOver && !isNewGame) {
    body.removeChild(gameOverEl);
  }

  resetGameState();
  setupCanvas();
  animate();
  setupEventListeners();
}

/**
 * Entry point of the game, called upon loading the script.
 * Immediately starts the game setup and execution.
 */
startGame();
