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


window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  canvas.height = rows * cellSize;
  canvas.width = cols * cellSize;
  ctx = canvas.getContext("2d");


  placeFood();
  update(); 
}

function update() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  ctx.fillRect(snakeX, snakeY, cellSize, cellSize);

  ctx.fillStyle = "red";
  ctx.fillRect(foodX, foodY, cellSize, cellSize);
}

function placeFood() {
  foodX = Math.floor(Math.random() * cols) * cellSize;
  foodY = Math.floor(Math.random() * rows) * cellSize;
}
