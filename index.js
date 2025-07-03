const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 20;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

// Draw grid
ctx.strokeStyle = "#ccc";
for (let x = 0; x <= cols; x++) {
  ctx.beginPath();
  ctx.moveTo(x * cellSize, 0);
  ctx.lineTo(x * cellSize, canvas.height);
  ctx.stroke();
}
for (let y = 0; y <= rows; y++) {
  ctx.beginPath();
  ctx.moveTo(0, y * cellSize);
  ctx.lineTo(canvas.width, y * cellSize);
  ctx.stroke();
}