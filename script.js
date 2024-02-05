const canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let isGameOver = false;
let isGameStarted = false;
let gameScore = 0;
const CANVAS_WIDTH = (canvas.width = 1500);
const CANVAS_HEIGHT = (canvas.height = 500);

const image1 = new Image();
image1.src = "./assets/ground.png";
const image2 = new Image();
image2.src = "./assets/ground.png";

const cactusImage = new Image();
cactusImage.src = "./assets/cactus.png";

const dinoImage = new Image();
dinoImage.src = "./assets/dino.png";

const dinoLose = new Image();
dinoLose.src = "./assets/dino-lose.png";

const dinoRun1 = new Image();
dinoRun1.src = "./assets/dino-run-0.png";

const dinoRun2 = new Image();
dinoRun2.src = "./assets/dino-run-1.png";

dinoImage.onload = () => {
  console.log("dino loaded");

  ctx.beginPath();
  ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 100);
  ctx.fillStyle = "#edf2fb";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(0, CANVAS_HEIGHT, CANVAS_WIDTH, -100);
  ctx.fillStyle = "#e8a2a2";
  ctx.fill();
  ctx.closePath();

  ctx.drawImage(dinoImage, 10, CANVAS_HEIGHT - 180);

  ctx.font = `48px "Press Start 2P"`;
  ctx.strokeText("START GAME", CANVAS_WIDTH / 2.7, CANVAS_HEIGHT / 2);
};

canvas.addEventListener("click", () => {
  if (isGameOver) {
    location.reload();
  }
});

window.addEventListener("keypress", (e) => {
  if (isGameOver) {
    ctx = canvas.getContext("2d");
    isGameOver = false;
    startGame();
    gameScore = 0;
  } else if (!isGameStarted) {
    isGameStarted = true;
    startGame();
  }
});

let x1Axis = 0;
let x2Axis = 1500;
let cactusCoord = CANVAS_WIDTH + 150;

let keyPressed = false;

// if (!isGameStarted) {
//   ctx.drawImage(image1, x1Axis, CANVAS_HEIGHT - 100);
//   ctx.drawImage(image2, x2Axis, CANVAS_HEIGHT - 100);

//   ctx.beginPath();
//   ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 100);
//   ctx.fillStyle = "#edf2fb";
//   ctx.fill();
//   ctx.closePath();

//   ctx.beginPath();
//   ctx.rect(0, CANVAS_HEIGHT, CANVAS_WIDTH, -100);
//   ctx.fillStyle = "#e8a2a2";
//   ctx.fill();
//   ctx.closePath();
// }

function startGame() {
  animate();
  generateCactus();
  animateDino();
}

function handleKeyPress(e) {
  console.log({ e });
  if (e.key === " ") {
    keyPressed = true;
    setTimeout(() => {
      keyPressed = undefined;
    }, 200);
  }
}

// let didKeyUp = false;

function limitKeyPress(fn) {
  let didRan = false;

  return function (e) {
    if (!didRan) {
      fn(e);
      didRan = true;

      setTimeout(() => {
        didRan = false;
      }, 500);
    }
  };
}

const fun = limitKeyPress(handleKeyPress);
console.log(fun);

window.addEventListener("keypress", fun);
// window.addEventListener("keyup", () => {
//   didKeyUp = true;
//   console.log("UPP");
// });

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.drawImage(image1, x1Axis, CANVAS_HEIGHT - 100);
  ctx.drawImage(image2, x2Axis, CANVAS_HEIGHT - 100);

  ctx.beginPath();
  ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 100);
  ctx.fillStyle = "#edf2fb";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(0, CANVAS_HEIGHT, CANVAS_WIDTH, -100);
  ctx.fillStyle = "#e8a2a2";
  ctx.fill();
  ctx.closePath();

  x1Axis -= 5;
  x2Axis -= 5;

  if (x1Axis === -1500) {
    x1Axis = 1500;
  }

  if (x2Axis === -1500) {
    x2Axis = 1500;
  }
  requestAnimationFrame(animate);
}

let position = Math.floor(Math.random() * 200);

let isCreated = false;
let cactus;

function generateCactus() {
  let previousCoordinate = CANVAS_WIDTH;
  for (let i = 0; i < 10; i++) {
    const cactus = new Cactus(previousCoordinate);
    previousCoordinate = cactus.cactusCoord;
  }
}

class Cactus {
  constructor(prevCoord) {
    this.image = new Image();
    this.image.src = "./assets/cactus.png";
    this.cactusCoord =
      prevCoord + this.image.width + Math.floor(Math.random() * 100) + 500;
    this.initialPos = this.cactusCoord;
    this.iteration = 1;

    this.animate = () => {
      ctx.drawImage(this.image, this.cactusCoord, CANVAS_HEIGHT - 155);

      this.cactusCoord -= 10;

      if (this.cactusCoord < -this.image.width) {
        this.cactusCoord =
          this.initialPos + this.image.width * Math.floor(Math.random() * 100);
        gameScore++;
      }
      ctx.font = `30px "Press Start 2P"`;
      ctx.strokeText(gameScore, CANVAS_WIDTH - 55, 55);

      if (this.cactusCoord <= 15 && this.cactusCoord >= 5) {
        if (isCollision()) {
          ctx.font = `48px "Press Start 2P"`;
          ctx.strokeText("GAME OVER", CANVAS_WIDTH / 2.7, CANVAS_HEIGHT / 2);
          isGameOver = true;
          // ctx.clearRect(
          //   0,
          //   0,
          //   dinoImage.width + this.image.width,
          //   CANVAS_HEIGHT
          // );
          if (yDist > 180) {
            ctx.drawImage(dinoLose, 10, CANVAS_HEIGHT - yDist + 9);
          } else {
            ctx.drawImage(dinoLose, 10, CANVAS_HEIGHT - yDist);
          }
          ctx.drawImage(this.image, this.cactusCoord + 10, CANVAS_HEIGHT - 155);

          ctx = null;
        }
      }

      requestAnimationFrame(this.animate);
    };

    this.image.onload = () => {
      this.animate();
    };
  }
}

let yDist = 180;
let jumpingDown = false;
let runSwitch = true;
let frameCount = 0;

function animateRunningDino() {
  runSwitch
    ? ctx.drawImage(dinoRun1, 10, CANVAS_HEIGHT - yDist)
    : ctx.drawImage(dinoRun2, 10, CANVAS_HEIGHT - yDist);
}

function animateDino() {
  if (!keyPressed) {
    if (yDist > 180) {
      ctx.drawImage(dinoImage, 10, CANVAS_HEIGHT - yDist);
      // animateRunningDino();
      yDist -= 9;
      jumpingDown = true;
    } else {
      animateRunningDino();
    }
  } else {
    animateRunningDino();
    yDist += 12;
  }

  frameCount++;

  if (frameCount === 20) {
    frameCount = 0;
    runSwitch = !runSwitch;
  }

  requestAnimationFrame(animateDino);
}

function isCollision() {
  const safeJump = 250;

  return yDist < safeJump;
}
