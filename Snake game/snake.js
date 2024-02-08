
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const eatSound = document.getElementById('eatSound');

const gridSize = 30;
let snake = [];
let food = {};
let direction = 'right';
let speed = 200; // milliseconds
let gameRunning = false;
let score = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    drawSnakeSegment(segment.x, segment.y, index === 0); // Head is true, body is false
  });

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function drawSnakeSegment(x, y, isHead) {
  ctx.beginPath();
  ctx.arc(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
  ctx.fillStyle = isHead ? 'purple' : 'blue'; // Head is blue, body is green
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  // Draw eyes on the head
  if (isHead) {
    drawEye(x, y, -gridSize / 4, -gridSize / 6); // Left eye
    drawEye(x, y, gridSize / 4, -gridSize / 6); // Right eye
  }
}

function drawEye(x, y, eyeOffsetX, eyeOffsetY) {
  ctx.beginPath();
  ctx.arc(x * gridSize + gridSize / 2 + eyeOffsetX, y * gridSize + gridSize / 2 + eyeOffsetY, gridSize / 8, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();

  // Draw black pupil
  const pupilSize = gridSize / 13;
  ctx.beginPath();
  ctx.arc(x * gridSize + gridSize / 2 + eyeOffsetX, y * gridSize + gridSize / 2 + eyeOffsetY, pupilSize, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

function update() {
  const head = { ...snake[0] };

  // Update snake's head based on direction
  if (direction === 'up') head.y--;
  else if (direction === 'down') head.y++;
  else if (direction === 'left') head.x--;
  else if (direction === 'right') head.x++;

  // Check for collision with walls
  if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
    gameOver();
    return;
  }

  // Check for collision with self
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    snake.unshift({ ...food });
    generateFood();
    eatSound.play();
    score += 10; // Øk poengsummen (du kan justere dette tallet etter ønske)
    speed -= 10;
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

function resetGame() {
  snake = [];
  direction = 'right';
  generateFood();
  gameRunning = false;
  document.getElementById('startButton').innerText = 'Start Game';
  document.getElementById('gameOverMessage').style.display = 'none';
  speed = 200; // Reset speed to its initial value
  score = 0; // Reset score
}

function gameOver() {
  gameRunning = false;
  document.getElementById('startButton').innerText = 'Start Game';
  document.getElementById('gameOverMessage').style.display = 'block';
}

function keyDownHandler(event) {
  if (!gameRunning) {
    gameRunning = true;
    document.getElementById('startButton').innerText = 'Pause Game';
    snake = [{ x: 10, y: 10 }]; // Initialize snake
    generateFood(); // Generate initial food
    document.getElementById('gameOverMessage').style.display = 'none';
    gameLoop();
  }

  if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  else if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  else if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  else if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
}

function startGame() {
  if (!gameRunning) {
    gameRunning = true;
    document.getElementById('startButton').innerText = 'Pause Game';
    snake = [{ x: 10, y: 10 }]; // Initialize snake
    generateFood(); // Generate initial food
    document.getElementById('gameOverMessage').style.display = 'none';
    score = 0; // Reset score
    gameLoop();
  } else {
    resetGame();
  }
}

document.addEventListener('keydown', keyDownHandler);

function gameLoop() {
  if (gameRunning) {
    update();
    draw();
    setTimeout(gameLoop, speed);
  }
}

resetGame(); // Call resetGame to initialize the game state
