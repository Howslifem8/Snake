//Game board
var cellSize = 25;
var rows = 20;
var cols = 20;
var canvas;
var ctx;

//Snake head 
var snakeX, snakeY;

//Snake food 
var foodX;
var foodY;

//Snake Speed Power up 
let speedPowerUp = false;
let speedPowerUpX, speedPowerUpY;
let speedPowerUpVisible = false;
let originalInterval = 1000 / 10; // 10 frames per second
let speedInterval = 1000 / 20; // 20 frames per second when speed power-up is active
let updateInterval; 
let powerUpTimeout;
let powerUpEnabled = true; // Flag to control power-up availability

//Snake Slow Down Ability 
let slowDownPowerUp = false;
let slowDownPowerUpX, slowDownPowerUpY;
let slowDownPowerUpVisible = false;
let slowDownInterval = 1000 / 5; // 5 frames per second when slow down power-up is active
let slowDownTimeout;
let slowDownEnabled = true; // Flag to control slow down power-up availability

//Snake Directon
var velocityX = 0;
var velocityY = 0;

//Preventing Double inputs / Reverse
var directionChanged = false;

//Snake body
var snakeBody = [];

//Personal Run tracking 
localStorage.setItem("gamesPlayed", localStorage.getItem("gamesPlayed") || 0);
//Best Run tracking 
localStorage.setItem("bestScore", localStorage.getItem("bestScore") || 0);
//Score 
let score = 0;

//Game Over Dictator 
var gameOver = false;

//Game run Time 
let startTime;


//Game loop
window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  setResponsiveCanvasSize(); // <== Call this
  snakeX = cellSize * 5;
  snakeY = cellSize * 5;
  ctx = canvas.getContext("2d");
  startTime = Date.now();

  

  placeFood();
  document.addEventListener("keydown", changeDirection, { passive: false });
  updateInterval = setInterval(update, originalInterval); //10 frames per second
  renderRunCards();
}

function update() {
  if (gameOver) {
    return;
  }
  
  //Draw Canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //Draw Food
  ctx.fillStyle = "red";
  ctx.fillRect(foodX, foodY, cellSize, cellSize);

  //Draw Speed Power-Up if active
  if (speedPowerUpVisible) {
    ctx.fillStyle = "blue"; // Color for speed power-up
    ctx.fillRect(speedPowerUpX, speedPowerUpY, cellSize, cellSize);
  }

  //Draw Slow Down Power-Up if active
  if (slowDownPowerUpVisible) {
    ctx.fillStyle = "yellow"; // Color for slow down power-up
    ctx.fillRect(slowDownPowerUpX, slowDownPowerUpY, cellSize, cellSize);
  }

 //Consuming Food

  if(snakeX === foodX && snakeY === foodY) {
    snakeBody.push([foodX, foodY]); 
    score += 1;
    scoreDisplay();
    placeFood();
  }

  //Check for Speed Power-Up
  if (speedPowerUpVisible && snakeX === speedPowerUpX && snakeY === speedPowerUpY) {
    speedPowerUp = true;
    speedPowerUpVisible = false;
    score += 1;
    scoreDisplay();
    clearInterval(updateInterval); // Clear the previous interval
    updateInterval = setInterval(update, speedInterval); // Set new interval for faster updates
    powerUpTimeout = setTimeout(() => {
      speedPowerUp = false;
      clearInterval(updateInterval);
      updateInterval = setInterval(update, originalInterval); // Reset to original speed
    }, 5000); // Power-up lasts for 5 seconds
  }

  //Check for Slow Down Power-Up
  if (slowDownPowerUpVisible && snakeX === slowDownPowerUpX && snakeY === slowDownPowerUpY) {
    slowDownPowerUp = true;
    slowDownPowerUpVisible = false;
    score += 1; 
    scoreDisplay();
    clearInterval(updateInterval); // Clear the previous interval
    updateInterval = setInterval(update, slowDownInterval); // Set new interval for slower updates
    slowDownTimeout = setTimeout(() => {
      slowDownPowerUp = false;
      clearInterval(updateInterval);
      updateInterval = setInterval(update, originalInterval); // Reset to original speed
    }, 5000); // Power-up lasts for 5 seconds
  }
  //Move Snake Body
  for (let i = snakeBody.length -1; i > 0; i--) {
    snakeBody[i] = snakeBody[i-1];
  }
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  // Draw Snake Head & Dictate Movement Speed
  ctx.fillStyle = "lime";
  snakeX += velocityX * cellSize;
  snakeY += velocityY * cellSize;
  ctx.fillRect(snakeX, snakeY, cellSize, cellSize);
  for (let i =0; i < snakeBody.length; i++) {
    ctx.fillRect(snakeBody[i][0], snakeBody[i][1], cellSize, cellSize);
  }

  directionChanged = false; // Reset direction change flag at the start of each frame
  //game over conditions
  if (snakeX < 0 || snakeX >= cols * cellSize || snakeY < 0 || snakeY >= rows * cellSize) { //Checks if snake is our of bounds
    gameOver = true;
    showGameOverModal();
  }
  for (let i =0; i < snakeBody.length; i++) {
    if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) { // Checks if snake collides with itself
      gameOver = true;
      showGameOverModal();
    }
  }

  
}
// Placing food randomly on the board
function placeFood() {
  foodX = Math.floor(Math.random() * cols) * cellSize;
  foodY = Math.floor(Math.random() * rows) * cellSize;

  //Roll for Speed power-up (10% chance) 
  if (powerUpEnabled && Math.random() < 0.1) {
    speedPowerUpX = Math.floor(Math.random() * cols) * cellSize;
    speedPowerUpY = Math.floor(Math.random() * rows) * cellSize;
    speedPowerUpVisible = true;
  } else {
    speedPowerUpVisible = false;
  }
  //Roll for Slow Down power-up (10% chance)
  if (slowDownEnabled && Math.random() < 0.1) {
    slowDownPowerUpX = Math.floor(Math.random() * cols) * cellSize;
    slowDownPowerUpY = Math.floor(Math.random() * rows) * cellSize;
    slowDownPowerUpVisible = true;
  } else {
    slowDownPowerUpVisible = false;
  }




}

// Change direction based on key press
function changeDirection(e) {
  if (directionChanged) return; // Prevent multiple direction changes in one frame

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
    e.preventDefault();
  }
  if (e.code === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
    directionChanged = true;
  } else if (e.code === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
    directionChanged = true;
  } else if (e.code === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
    directionChanged = true;
  } else if (e.code === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
    directionChanged = true;
  }
  
}

function scoreDisplay() {
  document.getElementById("score").innerHTML = "Score: " + score;
}

//Game over Modal 
function showGameOverModal() {
  const modal = document.getElementById("gameOverModal");
  const scoreDisplay = document.getElementById("finalScore");
  const timeDisplay = document.getElementById("gameTime");

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  scoreDisplay.textContent = "Score: " + score;
  timeDisplay.textContent = "Time: " + elapsedTime + "s";

  modal.classList.remove("hidden");
}

function saveRun(score, time) {
  const run = {
    score: score,
    time: time,
    date: new Date().toISOString()
  };

  // === Handle Personal Runs ===
  let personalRuns = JSON.parse(localStorage.getItem("personalRuns")) || [];
  personalRuns.unshift(run); 
  if (personalRuns.length > 7) personalRuns.pop(); // Keep latest 7 runs
  localStorage.setItem("personalRuns", JSON.stringify(personalRuns));

  // === Handle Best Runs ===
  let bestRuns = JSON.parse(localStorage.getItem("bestRuns")) || [];
  bestRuns.push(run);
  bestRuns.sort((a, b) => b.score - a.score); // Sort by highest score
  if (bestRuns.length > 5) bestRuns = bestRuns.slice(0, 10); // Keep top 5
  localStorage.setItem("bestRuns", JSON.stringify(bestRuns));
}

function renderRunCards() {
  const personalContainer = document.getElementById("personalRunsContainer");
  const bestContainer = document.getElementById("bestRunsContainer");

  personalContainer.innerHTML = ""; // Clear existing
  bestContainer.innerHTML = "";

  const personalRuns = JSON.parse(localStorage.getItem("personalRuns")) || [];
  const bestRuns = JSON.parse(localStorage.getItem("bestRuns")) || [];

  personalRuns.slice(0, 7).forEach(run => {
    const card = document.createElement("div");
    card.classList.add("run-card");
    card.innerHTML = `
      <strong>Score:</strong> ${run.score}<br>
      <strong>Time:</strong> ${run.time}s<br>
      <small>${new Date(run.date).toLocaleString()}</small>
    `;
    personalContainer.appendChild(card);
  });

  bestRuns.slice(0, 5).forEach(run => {
    const card = document.createElement("div");
    card.classList.add("run-card");
    card.innerHTML = `
      <strong>Score:</strong> ${run.score}<br>
      <strong>Time:</strong> ${run.time}s<br>
      <small>${new Date(run.date).toLocaleString()}</small>
    `;
    bestContainer.appendChild(card);
  });
}



//Restart Game Button Hnadler 
document.getElementById("restartBtn").addEventListener("click", () => {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  saveRun(score, elapsedTime); // Save run before reset
  renderRunCards();
  // Reset variables
  snakeX = cellSize * 5;
  snakeY = cellSize * 5;
  velocityX = 0;
  velocityY = 0;
  snakeBody = [];
  score = 0;
  gameOver = false;
  document.getElementById("score").textContent = "Score: 0";
  startTime = Date.now();
  document.getElementById("gameOverModal").classList.add("hidden");
});

//Game Canvas Responsiveness
function setResponsiveCanvasSize() {
  const maxWidth = window.innerWidth < 768 ? window.innerWidth * 0.9 : 600;
  const maxHeight = window.innerHeight < 768 ? window.innerHeight * 0.6 : 600;

  // Choose a cell size that ensures whole cells fit in the screen
  cellSize = 20;
  cols = Math.floor(maxWidth / cellSize);
  rows = Math.floor(maxHeight / cellSize);

  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;
}
