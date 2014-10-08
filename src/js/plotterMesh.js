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

// mesh squares
var meshSquares = [];

// add height points to squares
for ( var r = 0; r < meshInput.length - 1; r++ ) {
  for ( var c = 0; c < meshInput[ 0 ].length - 1 ; c++ ) {
    meshSquares.push({
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

// draw a path
function drawPath ( segments, color, dashed ) {
  var dashVal = 0;

  if ( dashed === true ) {
    dashVal = dashArray;
  }

  var line = new Path({
    segments: segments,
    strokeColor: color,
    strokeWidth: strokeWidth,
    dashArray: dashVal
  });

  return line;
}

// draw a mesh section
function drawSection ( allSideLengths ) {
  // section & side groups
  var section = new Group(),
      AB = new Group(),
      AC = new Group(),
      BD = new Group(),
      CD = new Group();

  // top & bottom points
  var B = new Point( canvasCenter - [ 0, allSideLengths.BC / 2 ] ),
      C = new Point( canvasCenter + [ 0, allSideLengths.BC / 2 ] );

  // center line
  var BC = drawPath( [ B, C ], 'red', true );

  // side AB
  AB.addChildren([
    drawPath( [ B, B + [ 0, allSideLengths.AB ] ], 'blue', true ),
    drawPath(
      [ B, B + [ - tabSize, tabSize ], B + [ - tabSize, allSideLengths.AB - tabSize ], B + [ 0, allSideLengths.AB ] ],
      'blue', false
    )
  ]);

  AB.rotate( 45, B );

  // add all lines/sides to section & scale
  section.addChildren( [ BC, AB ] );
  section.scale( scale );
}

console.log( getAllSideLengths( meshSquares[ 0 ] ) );
drawSection( getAllSideLengths( meshSquares[ 0 ] ) );