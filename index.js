//Game board
var cellSize = 25;
var rows = 27;
var cols = 27;
var canvas;
var ctx;

//Snake head 
var snakeX = cellSize * 5;
var snakeY = cellSize * 5;

//Snake food 
var foodX;
var foodY;

//Snake Directon
var velocityX = 0;
var velocityY = 0;

//Snake body
var snakeBody = [];

//Game Over Dictator 
var gameOver = false;

//Game loop
window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  canvas.height = rows * cellSize;
  canvas.width = cols * cellSize;
  ctx = canvas.getContext("2d");

  

  placeFood();
  document.addEventListener("keyup", changeDirection);
  setInterval(update, 1000/10); //10 frames per second
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


 //Consuming Food

  if(snakeX === foodX && snakeY === foodY) {
    snakeBody.push([foodX, foodY]); 
    placeFood();
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
 
  //game over conditions
  if (snakeX < 0 || snakeX >= cols * cellSize || snakeY < 0 || snakeY >= rows * cellSize) {
    gameOver = true;
    alert("Game Over");
  }

  for (let i =0; i < snakeBody.length; i++) {
    if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
      gameOver = true;
      alert("Game Over");
    }
  }


}
// Placing food randomly on the board
function placeFood() {
  foodX = Math.floor(Math.random() * cols) * cellSize;
  foodY = Math.floor(Math.random() * rows) * cellSize;
}
// Change direction based on key press
function changeDirection(e) {
  if (e.code === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
  
}
