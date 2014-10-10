// get canvas center
var canvas = $( '#plotterMesh' ),
    canvasCenter = new Point( canvas.width() / 2, canvas.height() / 2 );

// distance between points in 2d mesh & tab size
var baseLength = 10,
    diagonalLength = Math.sqrt( Math.pow( baseLength, 2 ) * 2 ),
    tabSize = 1;

// set a scale to make drawing easier
var scale = 20;

// set cut styles
var strokeWidth = 2,
    dashArray = [ 4, 4 ];

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

// draw a dot at points
function drawDot ( point, color ) {
  return new Path.Circle({
    center: point,
    radius: 1.5,
    fillColor: color
  });
}

// draw a section
function drawSection ( sideLengths ) {
  var B = new Point( canvasCenter, canvasCenter - sideLengths.BC  ),
      C = new Point( canvasCenter, canvasCenter + sideLengths.BC  );

  var section = new Group([
    drawDot( B, 'red' ),
    drawDot( C, 'blue' )
  ]);
}

drawSection( meshSquaresSides[ 0 ] );