// get canvas center
var canvas = $( '#plotterMesh' ),
    canvasCenter = new Point( canvas.width() / 2, canvas.height() / 2 );

// distance between points in 2d mesh & tab size
var baseLength = 10,
    diagonalLength = Math.sqrt( Math.pow( baseLength, 2 ) * 2 ),
    tabSize = 5;

// set cut styles
var strokeWidth = 1,
    dashArray = [ 2, 6 ];

// a grid of points of varying heights
// ● - ● - ●
// | / | / |
// ● - ● - ●
// | / | / |
// ● - ● - ●
// parent array stores rows
// child arrays store individual heights
var meshInput = [
  [ 0,  0,  0,  0, 0 ],
  [ 0, 15, 20, 15, 0 ],
  [ 0, 10, 25, 20, 0 ],
  [ 0,  5, 10, 15, 0 ],
  [ 0,  0,  0,  0, 0 ]
];

// set a scale to make drawing easier
var scale = 8;

// scale everything up
for ( var s = 0; s < meshInput.length; s++ ) {
  for ( var s2 = 0; s2 < meshInput[ 0 ].length; s2++ ) {
    meshInput[ s ][ s2 ] *= scale;
  }
}

baseLength *= scale;
diagonalLength *= scale;
tabSize *= scale;

// mesh squares height points
var meshSquaresHeights = [];

// add height points to squares
for ( var r = 0; r < meshInput.length - 1; r++ ) {
  for ( var c = 0; c < meshInput[ 0 ].length - 1 ; c++ ) {
    meshSquaresHeights.push({
      topLeft: meshInput[ r ][ c ],
      topRight: meshInput[ r ][ c + 1 ],
      bottomLeft: meshInput[ r + 1 ][ c ],
      bottomRight: meshInput[ r + 1 ][ c + 1  ]
    });
  }
}

// get length of side for two heights next to each other
function getSideLength ( base, aHeight, bHeight ) {
  return Math.sqrt(
    Math.pow( base, 2 ) + Math.pow( Math.abs( aHeight - bHeight ), 2 )
  );
}

// get all side lengths for a single mesh square
// A --- B
// |   ╱ |
// | ╱   |
// C --- D
function getAllSideLengths ( meshItem ) {
  return {
    AB: getSideLength( baseLength, meshItem.topLeft, meshItem.topRight ),
    AC: getSideLength( baseLength, meshItem.topLeft, meshItem.bottomLeft ),
    BC: getSideLength( diagonalLength, meshItem.topRight, meshItem.bottomLeft ),
    BD: getSideLength( baseLength, meshItem.topRight, meshItem.bottomRight ),
    CD: getSideLength( baseLength, meshItem.bottomLeft, meshItem.bottomRight )
  };
}

// mesh squares side lengths
var meshSquaresSides = [];

// add side lengths to squares
for ( var s = 0; s < meshSquaresHeights.length; s++ ) {
  meshSquaresSides.push( getAllSideLengths( meshSquaresHeights[ s ] ) );
}

// find Points
function findPoints ( sideLengths ) {
  var Bpoint = new Point( canvasCenter.x, canvasCenter.y - sideLengths.BC ),
      Cpoint = new Point( canvasCenter.x, canvasCenter.y + sideLengths.BC );

  var ABdistance = new Path.Circle( Bpoint, sideLengths.AB * 2 ),
      ACdistance = new Path.Circle( Cpoint, sideLengths.AC * 2 ),
      BDdistance = new Path.Circle( Bpoint, sideLengths.BD * 2 ),
      CDdistance = new Path.Circle( Cpoint, sideLengths.CD * 2 );

  var Apoint = ABdistance.getIntersections( ACdistance )[ 1 ].point,
      Dpoint = BDdistance.getIntersections( CDdistance )[ 0 ].point;

  return {
    A: Apoint,
    B: Bpoint,
    C: Cpoint,
    D: Dpoint
  };
}

// example square
var squareOne = findPoints( meshSquaresSides[ 0 ] );

// draw a tab
function drawTab ( pointA, pointB ) {
  // draw the fold line
  var fold = new Path.Line({
    from: pointA,
    to: pointB,
    strokeWidth: strokeWidth,
    dashArray: dashArray,
    strokeColor: 0,
  });

  // draw cut line
  var tab = new Path({
    segments: [
      pointA,
      ( pointA + [ tabSize, 0 ] ).rotate( ( pointB - pointA ).angle - 45, pointA ),
      ( pointB + [ tabSize, 0 ] ).rotate( ( pointA - pointB ).angle + 45 , pointB ),
      pointB
    ],
    strokeWidth: strokeWidth,
    strokeColor: 0
  });

  return fold, tab;
}

// draw a square
function drawSquare ( squarePoints ) {
  var square = new Group([
    drawTab( squarePoints.A, squarePoints.B ),
    drawTab( squarePoints.C, squarePoints.A ),
    drawTab( squarePoints.B, squarePoints.D ),
    drawTab( squarePoints.D, squarePoints.C ),
    new Path.Line({
      from: squarePoints.B,
      to: squarePoints.C,
      strokeWidth: strokeWidth,
      dashArray: dashArray,
      strokeColor: 0,
    })
  ]);

  return square;
}

drawSquare( findPoints( meshSquaresSides[ 3 ] ) );