// Images (local files)
const birdImg = new Image(); birdImg.src = "images/bird.png";
const pipeImg = new Image(); pipeImg.src = "images/pipe.png";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// State
let bird = { x: 50, y: 150, width: 34, height: 24, gravity: 0.6, lift: -10, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let started = false;

// UI
const homeScreen = document.getElementById('homeScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('finalScore');

// Audio
const bgm = document.getElementById('bgm');
const crash = document.getElementById('crashSound');

function resetGame() {
  bird.y = 150; bird.velocity = 0;
  pipes = []; frame = 0; score = 0; gameOver = false; started = true;
  scoreEl.textContent = '0';
  homeScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
  // try to play BGM
  try { bgm.currentTime = 0; bgm.play().catch(()=>{}); } catch(e){}
  requestAnimationFrame(gameLoop);
}

function showHome() {
  homeScreen.style.display = 'flex';
  gameOverScreen.style.display = 'none';
  started = false;
  try{ bgm.pause(); bgm.currentTime = 0; }catch(e){}
}

function showGameOver() {
  gameOver = true;
  try{ bgm.pause(); }catch(e){}
  try{ crash.currentTime = 0; crash.play(); }catch(e){}
  finalScoreEl.textContent = score;
  setTimeout(()=> gameOverScreen.style.display = 'flex', 200);
}

function drawBird() {
  if (birdImg.complete && birdImg.naturalWidth) {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  } else {
    ctx.fillStyle = 'yellow'; ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  }
}

function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    if (pipeImg.complete && pipeImg.naturalWidth) ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top);
    else ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    if (pipeImg.complete && pipeImg.naturalWidth) ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    else ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    showGameOver();
  }
}

function updatePipes() {
  if (frame % 120 === 0) {
    const gap = 140;
    const top = Math.random() * (canvas.height - gap - 80) + 30;
    const bottom = canvas.height - top - gap;
    pipes.push({ x: canvas.width, width: 52, top, bottom, scored:false });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2.5;

    // Collision
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      showGameOver();
    }

    // Score when pipe passes bird
    if (!pipe.scored && pipe.x + pipe.width < bird.x) {
      pipe.scored = true; score++; scoreEl.textContent = score;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > -10);
}

function gameLoop() {
  if (gameOver || !started) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBird(); drawPipes(); updateBird(); updatePipes();
  frame++; requestAnimationFrame(gameLoop);
}

// Controls
function flap() {
  if (gameOver) return;
  bird.velocity = bird.lift;
  try{ if (bgm.paused) bgm.play().catch(()=>{}); }catch(e){}
}

window.addEventListener('keydown', (e)=>{ if (e.code === 'Space' || e.key === ' ') {e.preventDefault(); flap();} else { flap(); } });
window.addEventListener('click', () => flap());
document.getElementById('playBtn').addEventListener('click', resetGame);
document.getElementById('restartBtn').addEventListener('click', ()=>{ showHome(); resetGame(); });
document.getElementById('homeBtn').addEventListener('click', showHome);

// Initialize
showHome();
