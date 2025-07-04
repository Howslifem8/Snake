var cellSize = 25;
var rows = 27;
var cols = 27;
var canvas;
var ctx;

window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  canvas.height = rows * cellSize;
  canvas.width = cols * cellSize;
  ctx = canvas.getContext("2d");

  update(); 
}

function update() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
