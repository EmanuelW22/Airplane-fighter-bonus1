document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");
  let score = 0;
  let gameSpeed = 2;
  let gameInterval;
  let obstaclesAvoided = 0;

  const squareSize = 30;
  const airplaneWidth = squareSize * 3;
  const airplaneHeight = squareSize * 5;

  let airplaneX = canvas.width / 2 - airplaneWidth / 2;
  let airplaneY = canvas.height - squareSize * 3;

  const startButton = document.getElementById("startButton");
  const resetButton = document.getElementById("resetButton");
  const scoreDisplay = document.getElementById("scoreDisplay");

  let keyState = {};

  startButton.addEventListener("click", startGame);
  resetButton.addEventListener("click", resetGame);

  function startGame() {
    startButton.disabled = true;
    resetButton.disabled = true;
    gameInterval = setInterval(updateGame, 10);
  }

  function resetGame() {
    clearInterval(gameInterval);
    obstaclesAvoided = 0;
    scoreDisplay.textContent = `Scor: ${obstaclesAvoided}`;
    airplaneX = canvas.width / 2 - airplaneWidth / 2;
    obstacles.length = 0;
    startButton.disabled = false;
    resetButton.disabled = true;
    clearCanvas();
    startGame();
  }

  function updateGame() {
    moveAirplane();
    moveObstacles();
    draw();
    scoreDisplay.textContent = `Scor: ${obstaclesAvoided}`;
  }

  function draw() {
    clearCanvas();
    drawAirplane();
    drawObstacles();
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawAirplane() {
    // Patratele de sus
    context.fillStyle = "yellow";
    context.fillRect(airplaneX, airplaneY, squareSize, squareSize);
    context.fillRect(airplaneX + squareSize, airplaneY, squareSize, squareSize);
    context.fillRect(
      airplaneX + squareSize * 2,
      airplaneY,
      squareSize,
      squareSize
    );

    // Patratul din mijloc
    context.fillStyle = "red";
    context.fillRect(
      airplaneX + squareSize,
      airplaneY + squareSize,
      squareSize,
      squareSize
    );

    // Patratul suplimentar deasupra celor galbene
    context.fillStyle = "blue";
    context.fillRect(
      airplaneX + squareSize,
      airplaneY - squareSize,
      squareSize,
      squareSize
    );

    // Patratele de jos
    context.fillStyle = "blue";
    context.fillRect(
      airplaneX,
      airplaneY + squareSize * 2,
      squareSize,
      squareSize
    );
    context.fillRect(
      airplaneX + squareSize,
      airplaneY + squareSize * 2,
      squareSize,
      squareSize
    );
    context.fillRect(
      airplaneX + squareSize * 2,
      airplaneY + squareSize * 2,
      squareSize,
      squareSize
    );
  }

  const obstacles = [];

  function createObstacle() {
    const obstacle = {
      x: Math.random() * (canvas.width - squareSize),
      y: 0,
      width: squareSize,
      height: squareSize,
      color: "red",
    };
    obstacles.push(obstacle);
  }

  function drawObstacles() {
    obstacles.forEach((obstacle) => {
      context.fillStyle = obstacle.color;
      context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  }

  function moveObstacles() {
    obstacles.forEach((obstacle) => {
      obstacle.y += gameSpeed;

      if (obstacle.y > canvas.height) {
        obstaclesAvoided++;
        obstacles.splice(obstacles.indexOf(obstacle), 1);
      }

      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacle.width;
      const obstacleTop = obstacle.y;
      const obstacleBottom = obstacle.y + obstacle.height;

      const isColliding =
        obstacleLeft < airplaneX + airplaneWidth &&
        obstacleRight > airplaneX &&
        obstacleTop < airplaneY + airplaneHeight &&
        obstacleBottom > airplaneY;

      if (isColliding) {
        gameOver();
        clearInterval(gameInterval);
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    keyState[event.key] = true;
  });

  document.addEventListener("keyup", (event) => {
    keyState[event.key] = false;
  });

  function moveAirplane() {
    if (keyState["ArrowLeft"] && airplaneX > 0) {
      airplaneX -= squareSize / 10; // Ajustați viteza de deplasare la stânga
    } else if (
      keyState["ArrowRight"] &&
      airplaneX < canvas.width - airplaneWidth
    ) {
      airplaneX += squareSize / 10; // Ajustați viteza de deplasare la dreapta
    }
  }

  function gameOver() {
    resetButton.disabled = false;
  }

  setInterval(createObstacle, 1000);
});
