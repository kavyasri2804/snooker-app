var cueStick;
var aimingAngle = 0;
var isStriking = false;
var strikeProgress = 0;
var strikeSpeed = 0.1;
var maxStrikeForce = 0.8;
var showCueStick = true;

function initializeCueStick() {
  var stickWidth = 150;
  var stickHeight = 10;
  cueStick = Bodies.rectangle(0, 0, stickWidth, stickHeight, {
    isStatic: true,
    collisionFilter: { group: -1 },
  });
  Matter.World.add(engine.world, cueStick);
}

function areAnyBallsMoving() {
  const velocityThreshold = 0.1;

  // Check cue ball
  if (
    Math.abs(cueBall.velocity.x) > velocityThreshold ||
    Math.abs(cueBall.velocity.y) > velocityThreshold
  ) {
    return true;
  }

  // Check colored balls
  for (let ball of colouredBalls) {
    if (
      Math.abs(ball.velocity.x) > velocityThreshold ||
      Math.abs(ball.velocity.y) > velocityThreshold
    ) {
      return true;
    }
  }

  // Check red balls
  for (let ball of redBalls) {
    if (
      Math.abs(ball.velocity.x) > velocityThreshold ||
      Math.abs(ball.velocity.y) > velocityThreshold
    ) {
      return true;
    }
  }

  return false;
}

function updateCueStickPosition() {
  // Update visibility based on ball movement
  showCueStick = !areAnyBallsMoving() && !isStriking;

  if (cueBall && showCueStick) {
    let offset = 80;
    cueStick.position.x = cueBall.position.x - offset * cos(aimingAngle);
    cueStick.position.y = cueBall.position.y - offset * sin(aimingAngle);
    Matter.Body.setAngle(cueStick, aimingAngle);
  }
}

function drawCueStick() {
  if (cueStick && showCueStick) {
    // Only draw if showCueStick is true
    push();
    translate(cueStick.position.x, cueStick.position.y);
    rotate(cueStick.angle);
    fill(139, 69, 19);
    rectMode(CENTER);
    rect(0, 0, 150, 10);
    pop();
  }
}

function strikeCueBall(strength) {
  const forceMultiplier = 0.01;
  const forceX = strength * cos(aimingAngle) * forceMultiplier;
  const forceY = strength * sin(aimingAngle) * forceMultiplier;
  moveCueBall(forceX, forceY); //Apply force to the cue ball
}

var isStriking = false;
var initialStickOffset = 80; // Distance from cue ball to the starting position of cue stick
var maxStrikeDistance = 20; // Distance cue stick moves forward to hit ball

function startStrike() {
  if (!isStriking && !areAnyBallsMoving()) {
    isStriking = true;
    strikeProgress = 0;
  }
}

function updateStrike() {
  if (isStriking) {
    strikeProgress += strikeSpeed;

    let baseOffset = 80;
    let strikeOffset = 40 * sin(strikeProgress * PI);
    let totalOffset = baseOffset + strikeOffset;

    cueStick.position.x = cueBall.position.x - totalOffset * cos(aimingAngle);
    cueStick.position.y = cueBall.position.y - totalOffset * sin(aimingAngle);
    Matter.Body.setAngle(cueStick, aimingAngle);

    if (strikeProgress >= 1) {
      let forceX = maxStrikeForce * cos(aimingAngle);
      let forceY = maxStrikeForce * sin(aimingAngle);

      Matter.Body.setVelocity(cueBall, { x: forceX * 15, y: forceY * 15 });

      isStriking = false;
      strikeProgress = 0;
    }
  }
}

function isBallStationary(ball) {
  const velocityThreshold = 0.1;
  return (
    Math.abs(ball.velocity.x) < velocityThreshold &&
    Math.abs(ball.velocity.y) < velocityThreshold
  );
}

function resetCueStickPosition() {
  isStriking = false;
}
