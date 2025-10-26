//declare given variables
var table_length = 800; // x axis
var table_width = table_length / 2; // y axis
var ballDiameter = table_width / 36;
var pocketSize = ballDiameter * 1.5;

//global position (start)
var startX, startY;

//radius of dzone
var radiusDzone = table_width / 5.5;

//border thickness
var borderThickness = 23;
var staticSetting = { isStatic: true, restitution: 0.8 };
var pocketSetting = { isStatic: true, isSensor: true };
var cushionSetting = { isStatic: true, restitution: 0.8 };
var allBorders = [];

var allPockets = [];

//var yellowCorners = [];
var yelCorners = [];

function drawTable() {
  //green felt
  fill(39, 119, 20);
  noStroke();
  rect(startX, startY, table_length, table_width);

  //D zone
  stroke(255);
  arc(
    startX + table_length / 4,
    startY + table_width - table_width / 2,
    radiusDzone * 2,
    radiusDzone * 2,
    PI / 2,
    (3 * PI) / 2
  );

  //vertical line at end of dzone
  stroke(255);
  line(
    startX + table_length / 4,
    startY,
    startX + table_length / 4,
    startY + table_width
  );
}

function tableBorder() {
  topBorder = Bodies.rectangle(
    startX + table_length / 2,
    startY - borderThickness / 2,
    table_length,
    borderThickness,
    staticSetting
  );
  bottomBorder = Bodies.rectangle(
    startX + table_length / 2,
    startY + table_width + borderThickness / 2,
    table_length,
    borderThickness,
    staticSetting
  );
  leftBorder = Bodies.rectangle(
    startX - borderThickness / 2,
    startY + table_width / 2,
    borderThickness,
    table_width,
    staticSetting
  );
  rightBorder = Bodies.rectangle(
    startX + table_length + borderThickness / 2,
    startY + table_width / 2,
    borderThickness,
    table_width,
    staticSetting
  );

  allBorders = [topBorder, bottomBorder, leftBorder, rightBorder];
  Matter.World.add(engine.world, allBorders);
}

function drawTableBorder() {
  noStroke();
  fill(74, 4, 4);
  for (var i = 0; i < allBorders.length; i++) {
    drawVertices(allBorders[i].vertices);
  }
}

function tablePockets() {
  tlPocket = Bodies.circle(startX, startY, pocketSize, pocketSetting);
  trPocket = Bodies.circle(
    startX + table_length,
    startY,
    pocketSize,
    pocketSetting
  );
  tmPocket = Bodies.circle(
    startX + table_width,
    startY,
    pocketSize,
    pocketSetting
  );
  blPocket = Bodies.circle(
    startX,
    startY + table_width,
    pocketSize,
    pocketSetting
  );
  brPocket = Bodies.circle(
    startX + table_length,
    startY + table_width,
    pocketSize,
    pocketSetting
  );
  bmPocket = Bodies.circle(
    startX + table_width,
    startY + table_width,
    pocketSize,
    pocketSetting
  );

  allPockets = [tlPocket, trPocket, tmPocket, blPocket, brPocket, bmPocket];
  Matter.World.add(engine.world, allPockets);
}

function drawTablePockets() {
  fill(0);
  for (var i = 0; i < allPockets.length; i++) {
    drawVertices(allPockets[i].vertices);
  }
}

//yellow corners around the pockets
function yellowCorners() {
  var cornerThickness = 30;
  // Circular bodies for corners pockets
  btlCorner = Bodies.rectangle(
    startX - 10,
    startY - 10,
    pocketSize * 2,
    cornerThickness,
    pocketSetting
  );
  btrCorner = Bodies.rectangle(
    startX + table_length + 10,
    startY - 10,
    pocketSize * 2,
    cornerThickness,
    pocketSetting
  );
  bblCorner = Bodies.rectangle(
    startX - 10,
    startY + table_width + 10,
    pocketSize * 2,
    cornerThickness,
    pocketSetting
  );
  bbrCorner = Bodies.rectangle(
    startX + table_length + 10,
    startY + table_width + 10,
    pocketSize * 2,
    cornerThickness,
    pocketSetting
  );

  //Rect bodies for the middle pockets
  btmCorner = Bodies.rectangle(
    startX + table_width,
    startY - 10,
    pocketSize * 3,
    25,
    pocketSetting
  );
  bbmCorner = Bodies.rectangle(
    startX + table_width,
    startY + table_width + 10,
    pocketSize * 3,
    25,
    pocketSetting
  );

  yelCorners = [
    btlCorner,
    btrCorner,
    bblCorner,
    bbrCorner,
    btmCorner,
    bbmCorner,
  ];
  Matter.World.add(engine.world, yelCorners);
}

function drawYellowCorners() {
  fill(255, 215, 0);
  for (var i = 0; i < yelCorners.length; i++) {
    drawVertices(yelCorners[i].vertices);
  }
}

//use trapezoids
var allCushions = [];

function tableCushions() {
  const cushionWidth = 10;  // Height of the trapezoid
  const cushionLength = (table_length - pocketSize * 4) / 2;  // Horizontal length of the trapezoid
  const angledCushionSize = cushionWidth * 0.25;  // Size for the angled edge of the trapezoid

  // Top cushions (trapezoid)
  const topLeftCushion = Bodies.fromVertices(
    startX + cushionLength / 2 + pocketSize, 
    startY - cushionWidth / 2,
    [
      { x: 0, y: 0 }, 
      { x: cushionLength, y: 0 }, 
      { x: cushionLength - angledCushionSize, y: cushionWidth }, 
      { x: angledCushionSize, y: cushionWidth }, 
    ],
    cushionSetting
  );

  const topRightCushion = Bodies.fromVertices(
    startX + table_length - cushionLength / 2 - pocketSize, 
    startY - cushionWidth / 2,
    [
      { x: 0, y: 0 }, 
      { x: -cushionLength, y: 0 }, 
      { x: -(cushionLength - angledCushionSize), y: cushionWidth }, 
      { x: -angledCushionSize, y: cushionWidth }, 
    ],
    cushionSetting
  );

  // Bottom cushions (trapezoid)
  const bottomLeftCushion = Bodies.fromVertices(
    startX + cushionLength / 2 + pocketSize, 
    startY + table_width + cushionWidth / 2,
    [
      { x: 0, y: 0 }, 
      { x: cushionLength, y: 0 }, 
      { x: cushionLength - angledCushionSize, y: -cushionWidth }, 
      { x: angledCushionSize, y: -cushionWidth }, 
    ],
    cushionSetting
  );

  const bottomRightCushion = Bodies.fromVertices(
    startX + table_length - cushionLength / 2 - pocketSize, 
    startY + table_width + cushionWidth / 2,
    [
      { x: 0, y: 0 }, 
      { x: -cushionLength, y: 0 }, 
      { x: -(cushionLength - angledCushionSize), y: -cushionWidth }, 
      { x: -angledCushionSize, y: -cushionWidth }, 
    ],
    cushionSetting
  );

  // Side cushions (trapezoid)
  const leftCushion = Bodies.fromVertices(
    startX - cushionWidth / 2, 
    startY + table_width / 2,
    [
      { x: 0, y: 0 }, 
      { x: cushionWidth, y: 0 }, 
      { x: cushionWidth, y: table_width - pocketSize * 2 },
      { x: 0, y: table_width - pocketSize * 2 }, 
    ],
    cushionSetting
  );

  const rightCushion = Bodies.fromVertices(
    startX + table_length + cushionWidth / 2, 
    startY + table_width / 2,
    [
      { x: 0, y: 0 }, 
      { x: -cushionWidth, y: 0 }, 
      { x: -cushionWidth, y: table_width - pocketSize * 2 }, 
      { x: 0, y: table_width - pocketSize * 2 }, 
    ],
    cushionSetting
  );

  // Angled cushions (trapezoid)
  const topLeftAngledCushion = Bodies.fromVertices(
    startX + pocketSize + cushionLength * 0.8, 
    startY,
    [
      { x: 0, y: 0 },
      { x: angledCushionSize, y: cushionWidth }, // Reduced angle
      { x: 0, y: angledCushionSize },
    ],
    cushionSetting
  );

  const topRightAngledCushion = Bodies.fromVertices(
    startX + table_length - pocketSize - cushionLength * 0.8, 
    startY,
    [
      { x: 0, y: 0 },
      { x: -angledCushionSize, y: cushionWidth }, 
      { x: 0, y: angledCushionSize },
    ],
    cushionSetting
  );

  const bottomLeftAngledCushion = Bodies.fromVertices(
    startX + pocketSize + cushionLength * 0.8, 
    startY + table_width,
    [
      { x: 0, y: 0 },
      { x: angledCushionSize, y: -cushionWidth }, 
      { x: 0, y: -angledCushionSize },
    ],
    cushionSetting
  );

  const bottomRightAngledCushion = Bodies.fromVertices(
    startX + table_length - pocketSize - cushionLength * 0.8, 
    startY + table_width,
    [
      { x: 0, y: 0 },
      { x: -angledCushionSize, y: -cushionWidth }, 
      { x: 0, y: -angledCushionSize },
    ],
    cushionSetting
  );

  // Combine cushions
  allCushions = [
    topLeftCushion,
    topRightCushion,
    bottomLeftCushion,
    bottomRightCushion,
    leftCushion,
    rightCushion,
    topLeftAngledCushion,
    topRightAngledCushion,
    bottomLeftAngledCushion,
    bottomRightAngledCushion,
  ];

  Matter.World.add(engine.world, allCushions);
}

function drawCushions() {
  fill(150, 121, 105); // Color
  for (const cushion of allCushions) {
    drawVertices(cushion.vertices);
  }
}