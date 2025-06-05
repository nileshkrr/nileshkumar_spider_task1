const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const restartBtn = document.getElementById("restartBtn");

let angle = 0;
let direction = 1; // 1 for forward, -1 for backward
let stopped = false;
let animationId;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 120;

function drawNeedle(angleDegrees) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw base circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();

  // Calculate needle end point
  const angleRad = (angleDegrees * Math.PI) / 180;
  const x = centerX + radius * Math.cos(angleRad);
  const y = centerY - radius * Math.sin(angleRad);

  // Draw needle
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "#e91e63";
  ctx.lineWidth = 5;
  ctx.stroke();
}

function animateNeedle() {
  if (!stopped) {
    drawNeedle(angle);
    angle += direction * 2;

    if (angle >= 180 || angle <= 0) {
      direction *= -1;
    }

    animationId = requestAnimationFrame(animateNeedle);
  }
}

function stopNeedle() {
  if (!stopped) {
    stopped = true;
    cancelAnimationFrame(animationId);
    drawNeedle(angle);
    const score = calculateScore(angle);
    scoreDisplay.innerText = `Stopped at ${Math.round(angle)}° → Score: ${score}/100`;
    restartBtn.style.display = "inline-block";
  }
}

function calculateScore(deg) {
  const diff = Math.abs(deg - 90);
  const score = Math.max(0, 100 - Math.round((diff / 90) * 100));
  return score;
}

canvas.addEventListener("click", stopNeedle);
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") stopNeedle();
});

restartBtn.addEventListener("click", () => {
  angle = 0;
  direction = 1;
  stopped = false;
  scoreDisplay.innerText = "Click or press Space to stop the needle!";
  restartBtn.style.display = "none";
  animateNeedle();
});

animateNeedle();
