let bird = document.getElementById("bird");
let pipeTop = document.getElementById("pipeTop");
let pipeBottom = document.getElementById("pipeBottom");

let homeScreen = document.getElementById("homeScreen");
let gameOverScreen = document.getElementById("gameOverScreen");

let bgMusic = document.getElementById("bgMusic");
let crashSound = document.getElementById("crashSound");

let startBtn = document.getElementById("startBtn");
let restartBtn = document.getElementById("restartBtn");
let homeBtn = document.getElementById("homeBtn");

let gravity = 2;
let birdTop = 200;
let pipePos = -100;
let speed = 3;
let gameRunning = false;

document.addEventListener("keydown", () => {
    if (gameRunning) birdTop -= 40;
});

startBtn.onclick = () => startGame();
restartBtn.onclick = () => startGame();
homeBtn.onclick = () => showHomeScreen();

function startGame() {
    homeScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    birdTop = 200;
    pipePos = -100;

    gameRunning = true;
    bgMusic.currentTime = 0;
    bgMusic.play();

    gameLoop();
}

function showHomeScreen() {
    gameOverScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
}

function gameLoop() {
    if (!gameRunning) return;

    birdTop += gravity;
    bird.style.top = birdTop + "px";

    pipePos += speed;
    pipeTop.style.right = pipePos + "px";
    pipeBottom.style.right = pipePos + "px";

    if (pipePos > window.innerWidth) {
        pipePos = -100;
    }

    // Collision
    if (
        (pipePos > (window.innerWidth - 200) &&
        pipePos < (window.innerWidth - 120) &&
        (birdTop < 200 || birdTop > window.innerHeight - 250)) ||
        birdTop > window.innerHeight - 40
    ) {
        endGame();
        return;
    }

    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    bgMusic.pause();
    crashSound.play();

    gameOverScreen.classList.remove("hidden");
}
