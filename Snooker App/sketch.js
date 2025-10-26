/*Commentary on Snooker App Design

The snooker app I designed is tailored to meet the project requirements while focusing on simplicity and functionality. It features an intuitive control system that uses mouse interactions for key gameplay mechanics, complemented by clear on-screen instructions to guide players.

The app allows players to position the cue ball within the "D" zone by clicking with the mouse. This approach was chosen because it offers a straightforward and precise way for users to interact with the game. Once the ball is placed, players can strike it either by clicking the mouse again or by pressing the spacebar, giving them flexibility in how they play. Aiming is handled entirely with the mouse—players can adjust the angle of the cue stick by moving the cursor. This method closely mimics real-life snooker, creating a smooth and immersive experience.

Instructions for playing the game are displayed in the top-left corner of the screen. They explain how to position the ball, aim, and strike, making it easy for users to get started without needing external help. Having these instructions visible at all times ensures players can quickly pick up the controls and enjoy the game.

The decision to make mouse controls the primary interaction method was deliberate. It keeps the gameplay simple and precise, making it accessible for both beginners and more experienced players. This straightforward control system lets players focus on the game itself without being overwhelmed by complicated mechanics.

Looking ahead, I plan to expand the app with additional features to enhance the experience. One idea is to introduce a dark mode, which would not only provide an option for low-light environments but also give the app a modern and polished appearance. Another planned extension is the addition of more obstacles, such as moving barriers or rotating blocks, which would make the game even more challenging. These features aim to keep the gameplay fresh and engaging, encouraging players to keep improving their skills.

In summary, the app stays true to the core requirements while remaining simple. The planned extensions, such as dark mode and additional obstacles, will make the app even more dynamic and appealing in the future.
*/


//matter
var Engine = Matter.Engine;
var World = Matter.World;
var Render = Matter.Render;
var Bodies = Matter.Bodies;

var engine;

function setup() {
  createCanvas(1400, 800);

  engine = Engine.create();
  engine.world.gravity.y = 0;

  //start position
  startX = width / 2 - table_length / 2;
  startY = height / 2 - table_width / 2;

  initializeColouredBallSpots();
  tableCushions();
  tableBorder();
  yellowCorners();
  tablePockets();

  initializeRedBalls();
  initializeColouredBalls();
  initializeCueBall();
  initializeCueStick();

  detectCueBallCollisions();
}

// Cue ball appears once mouse clicked
function mousePressed() {
  if (isPlacingCueBall) {
    const dzoneX = startX + table_length / 5;
    const dzoneY = startY + table_width / 2;

    const distanceFromCenter = dist(mouseX, mouseY, dzoneX, dzoneY);
    if (distanceFromCenter <= radiusDzone) {
      Matter.Body.setPosition(cueBall, { x: mouseX, y: mouseY });
      Matter.Body.setStatic(cueBall, false); // Allow the cue ball to move
      isPlacingCueBall = false; // End placement mode
    }
  } else {
    startStrike(); // Regular strike functionality
  }
}

// var lastPottedBall = null;
var mistakeMade = false;

//2 consecutive coloured balls (error)
function checkForConsecutiveColouredBalls(ball) {
  // console.log("Last potted ball: ", lastPottedBall);
  if (
    lastPottedBall &&
    ball !== lastPottedBall &&
    colouredBalls.includes(ball)
  ) {
    if (lastPottedBall && colouredBalls.includes(lastPottedBall)) {
      mistakeMade = true;
      console.log("Mistake: Two consecutive coloured balls potted");
    }
  }
  lastPottedBall = ball;
}

function draw() {
  Engine.update(engine);
  background(211, 211, 211);

  drawTable();
  drawTableBorder();

  //cushion
  drawCushions();

  drawYellowCorners();
  drawTablePockets();

  //howtoplay
  drawInstructions();

  //Check if any ball has fallen into a pocket
  for (let i = 0; i < redBalls.length; i++) {
    if (checkBallInPocket(redBalls[i])) {
      //potted red ball
      Matter.World.remove(engine.world, redBalls[i]);
      redBalls.splice(i, 1);
      lastPottedBall = null;
      break;
    }
  }

  colouredBalls.forEach((ball) => {
    if (checkBallInPocket(ball)) {
      reSpotColouredBall(ball);
      checkForConsecutiveColouredBalls(ball);
    }
  });
  // Check for cue ball pocketing
  if (checkBallInPocket(cueBall)) {
    // Reset cue ball in D zone
    Matter.World.remove(engine.world, cueBall);
    isPlacingCueBall = true;
    initializeCueBall(); // Put cue ball back in the D-zone
  }

  //drawing balls
  drawRedBalls();
  drawColouredBalls();
  drawCueBall();

  updateStrike();
  updateCueStickPosition();
  drawCueStick();
}

function drawVertices(vertices) {
  beginShape();
  for (let point of vertices) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
}

function mouseMoved() {
  if (cueBall) {
    aimingAngle = atan2(
      mouseY - cueBall.position.y,
      mouseX - cueBall.position.x
    );
  }
}

//prevent page from scrolling when spacebar pressed while console is open
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
  }
});

function keyPressed() {
  if (key === " ") {
    if (!isStriking) {
      startStrike();
    }
    //mode 1
  } else if (key === "1") {
    setup();
    //mode 2
  } else if (key === "2") {
    randomizeRedBalls(); // Randomize positions of red balls only
    //mode 3
  } else if (key === "3") {
    randomizeAllBalls(); // Randomize positions of both red and colored balls
  }
}

function resetBalls() {
  initializeRedBalls(); // Reset red balls
  initializeColouredBalls(); // Reset coloured balls
}

function randomizeRedBalls() {
  Matter.World.remove(engine.world, redBalls); // Remove current red balls from the world
  redBalls = [];

  for (let i = 0; i < 15; i++) {
    const posX = random(startX + 100, startX + table_length - 100);
    const posY = random(startY + 100, startY + table_width - 100);
    const ball = Bodies.circle(posX, posY, ballDiameter, ballSetting);
    redBalls.push(ball);
  }

  Matter.World.add(engine.world, redBalls);
}

function randomizeAllBalls() {
  randomizeRedBalls(); // Randomize red balls

  colouredBalls.forEach((ball, index) => {
    const posX = random(startX + 100, startX + table_length - 100);
    const posY = random(startY + 100, startY + table_width - 100);
    Matter.Body.setPosition(ball, { x: posX, y: posY });
    Matter.Body.setVelocity(ball, { x: 0, y: 0 });
    Matter.Body.setAngle(ball, 0); // Reset angle
  });
}

function drawInstructions() {
  textSize(17);
  text("How to play:", 20, 25);
  text("Click 1, 2, 3 - Change modes", 20, 50);
  text("1: Starting Position", 20, 70);
  text("2: Random red balls", 20, 90);
  text("3: Random red and coloured balls", 20, 110);
  text("Mouse Click - Place the cue ball in D Zone", 20, 130);
  text("Spacebar/Mouse Click - Strike the ball", 20, 150);
}
