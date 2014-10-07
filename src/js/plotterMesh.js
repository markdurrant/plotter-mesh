// distance between points in 2d mesh
var baseLength     = 10,
    diagonalLength = Math.sqrt( Math.pow( baseLength, 2 ) * 2 );

// set a scale to make drawing easier
var scale = 10;

// set cut styles
var cutStyle = {
  strokeColor: 'black',
  strokeWidth: 2,
};

// set fold styles
var foldStyle = cutStyle;
    foldStyle.dashArray = [ 4, 4 ];

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
  [ 0,  0,  0,  0, 0 ],
];

// get number of rows & columns in mesh
var meshRows = meshInput.length,
 meshColumns = meshInput[ 0 ].length;

// mesh squares
var meshSquares = [];

// add height points to squares
for ( var r = 0; r < meshRows - 1; r++ ) {
  for ( var c = 0; c < meshColumns; c++ ) {
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

// get all side lengths a single mesh square
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

new Path.Line( [ 100, 100 ], [ 100, 200 ] ).style = cutStyle;

console.log(
  foldStyle
);