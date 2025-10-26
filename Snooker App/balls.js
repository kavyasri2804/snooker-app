// Constants
var table_length = 800; // x axis
var table_width = table_length / 2; // y axis
var startX, startY;
var radiusDzone = table_width / 5.5;
let colouredBallSpots;

const ballSetting = {
  isStatic: false,
  restitution: 0.9,
  friction: 0.2,
};

// Ball Colors
const ballColors = {
  blue: [0, 71, 171],
  green: [53, 94, 59],
  brown: [150, 75, 0],
  yellow: [255, 234, 0],
  black: [0],
  pink: [248, 131, 121],
};

function initializeColouredBallSpots() {
  colouredBallSpots = {
    blue: { x: startX + table_length / 2, y: startY + table_width / 2 },
    green: { x: startX + table_length / 4, y: startY + table_width / 3.2 },
    brown: { x: startX + table_length / 4, y: startY + table_width / 2 },
    yellow: {
      x: startX + table_length / 4,
      y: startY + table_width / 2 + radiusDzone,
    },
    black: { x: startX + table_length - 70, y: startY + table_width / 2 },
    pink: { x: startX + table_length / 2 + 165, y: startY + table_width / 2 },
  };
}

// Initialize Red Balls in a Pyramid Formation
function initializeRedBalls() {
  redBalls = [];

  const pyramidBaseX = startX + table_length / 3.5 + 360;
  const pyramidBaseY = startY + table_width / 2;

  const offsetX = ballDiameter * Math.sqrt(3);
  const offsetY = ballDiameter;

  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    for (let ballIndex = 0; ballIndex <= rowIndex; ballIndex++) {
      const posX = pyramidBaseX + rowIndex * offsetY * 1.5;
      const posY = pyramidBaseY + (ballIndex - rowIndex / 2) * (offsetX + 7);
      const ball = Bodies.circle(posX, posY, ballDiameter, ballSetting);
      redBalls.push(ball);
    }
  }

  Matter.World.add(engine.world, redBalls);
}

// Initialize Colored Balls
function initializeColouredBalls() {
  const coloredBallPositions = [
    {
      color: "blue",
      x: startX + table_length / 2,
      y: startY + table_width / 2,
    },
    {
      color: "green",
      x: startX + table_length / 4,
      y: startY + table_width / 3.2,
    },
    {
      color: "brown",
      x: startX + table_length / 4,
      y: startY + table_width / 2,
    },
    {
      color: "yellow",
      x: startX + table_length / 4,
      y: startY + table_width / 2 + radiusDzone,
    },
    {
      color: "black",
      x: startX + table_length - 70,
      y: startY + table_width / 2,
    },
    {
      color: "pink",
      x: startX + table_length / 2 + 165,
      y: startY + table_width / 2,
    },
  ];

  colouredBalls = coloredBallPositions.map((pos) =>
    Object.assign(Bodies.circle(pos.x, pos.y, ballDiameter, ballSetting), {
      color: pos.color,
    })
  );

  Matter.World.add(engine.world, colouredBalls);
}

// Draw Balls
function drawBalls(balls) {
  noStroke();

  balls.forEach((ball) => {
    fill(ballColors[ball.color] || [178, 34, 34]); // Default to red if not found
    drawVertices(ball.vertices);
  });
}

// Draw Red Balls
function drawRedBalls() {
  drawBalls(redBalls.map((ball) => ({ ...ball, color: "red" })));
}

// Draw Coloured Balls
function drawColouredBalls() {
  const coloredBallNames = [
    "blue",
    "green",
    "brown",
    "yellow",
    "black",
    "pink",
  ];
  coloredBallNames.forEach((colorName, index) => {
    if (colouredBalls[index]) {
      drawBalls([{ ...colouredBalls[index], color: colorName }]);
    }
  });
}

var isPlacingCueBall = true;

// Cue Ball Initialization and Drawing
function initializeCueBall() {
  const dzoneX = startX + table_length / 5;
  const dzoneY = startY + table_width / 2;
  const dzoneRadius = radiusDzone;

  // Create a stationary cue ball initially off-screen
  cueBall = Bodies.circle(-100, -100, ballDiameter, {
    ...ballSetting,
    isStatic: true,
  });
  Matter.World.add(engine.world, cueBall);
}

function drawCueBall() {
  if (cueBall) {
    noStroke();
    fill(255); // White color for the cue ball
    drawVertices(cueBall.vertices);
  }
}

// Move Cue Ball with Force
function moveCueBall(strengthX, strengthY) {
  if (cueBall) {
    console.log("Before force:", cueBall.position);
    const forceMultiplier =
      strengthX || strengthY
        ? strengthX
          ? strengthX * 0.07
          : strengthY * 0.07
        : 0.05;
    Matter.Body.applyForce(
      cueBall,
      { x: cueBall.position.x, y: cueBall.position.y },
      {
        x: strengthX * forceMultiplier || forceMultiplier,
        y: strengthY * forceMultiplier || forceMultiplier,
      }
    );
    console.log("After force:", cueBall.position);
  } else {
    console.log("Cue ball not found.");
  }
}

// Check if Ball is in Pocket
function checkBallInPocket(ball) {
  return allPockets.some(
    (pocket) =>
      dist(
        ball.position.x,
        ball.position.y,
        pocket.position.x,
        pocket.position.y
      ) <= pocketSize
  );
}

// Reset Cue Ball Position
function resetCueBall() {
  const dzoneX = startX + table_length / 5;
  const dzoneY = startY + table_width / 2;
  Matter.Body.setPosition(cueBall, { x: dzoneX, y: dzoneY - radiusDzone / 3 });
  Matter.Body.setVelocity(cueBall, { x: 0, y: 0 });
}

var lastPottedBall;

function reSpotColouredBall(ball) {
  var spot = colouredBallSpots[ball.color];
  if (spot) {
    Matter.Body.setPosition(ball, spot);
    Matter.Body.setVelocity(ball, { x: 0, y: 0 });
    Matter.Body.setAngle(ball, 0); // Reset angle if needed
  } else {
    console.log("No designated spot for this ball color.");
  }
}

//ball collision detection
function detectCueBallCollisions() {
  Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
      const { bodyA, bodyB } = collision;
      let cueBallCollidedWith = null;

      // Check if cue ball is involved
      if (bodyA === cueBall) {
        cueBallCollidedWith = bodyB;
      } else if (bodyB === cueBall) {
        cueBallCollidedWith = bodyA;
      }

      // If cue ball involved, find type of collision
      if (cueBallCollidedWith) {
        if (redBalls.includes(cueBallCollidedWith)) {
          console.log("Cue ball hit a red ball");
        } else if (colouredBalls.includes(cueBallCollidedWith)) {
          console.log(`Cue ball hit a ${cueBallCollidedWith.color} ball`);
        } else if (
          allCushions.includes(cueBallCollidedWith) &&
          !allPockets.includes(cueBallCollidedWith)
        ) {
          console.log("Cue ball hit the cushion");
        }
      }
    });
  });
}
