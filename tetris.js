// Obtén el canvas del DOM
const canvas = document.getElementById('tetris');
// Obtén el contexto de renderizado 2D del canvas
const context = canvas.getContext('2d');

// Función para dibujar un patrón de prueba
function drawTestPattern() {
  // Dibuja un rectángulo rojo para probar
  context.fillStyle = 'red';
  context.fillRect(50, 50, 100, 100);
}

// Llama a la función de dibujo para probar
drawTestPattern();

// Set the scaling factor
context.scale(20, 20);

function drawTestPattern() {
  // Dibuja un rectángulo rojo para probar
  context.fillStyle = 'red';
  context.fillRect(50, 50, 100, 100);
}
// Define constants and variables
const BOARD_SIZE = 20; // Size of the game board
let board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0)); // Initialize the game board
let currentPiece = {}; // Current piece in play
let nextRandom = 0; // Next random piece
let score = 0; // Player's score
let lines = 0; // Number of lines cleared
let level = 0; // Current game level

// Draw a matrix on the canvas
function drawMatrix(matrix, offset = { x: 0, y: 0 }) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value!== 0) {
        context.fillStyle = 'ed'; // Change this to reflect the piece color
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}
// Modifica la función drawMatrix en tetris.js para incluir el color
function drawMatrix(matrix, offset, color) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value!== 0) {
        context.fillStyle = color;
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}
// Continuando en tetris.js

function removeCompletedLines(board) {
  let rowCount = 0;
  outer: for (let y = board.length - 1; y > 0; --y) {
    for (let x = 0; x < board[y].length; ++x) {
      if (board[y][x] === 0) {
        continue outer;
      }
    }

    // Si llegamos aquí, la línea completa fue eliminada
    const row = board.splice(y, 1)[0].fill(0);
    board.unshift(row);
    ++rowCount;
  }

  return rowCount;
}
// Función para mover la pieza actual hacia abajo
function drop() {
  // Implementa la lógica para mover la pieza hacia abajo
}

// Función para mover la pieza actual hacia la izquierda
function moveLeft() {
  // Implementa la lógica para mover la pieza hacia la izquierda
}

// Función para mover la pieza actual hacia la derecha
function moveRight() {
  // Implementa la lógica para mover la pieza hacia la derecha
}

// Función para rotar la pieza actual
function rotate() {
  // Implementa la lógica para rotar la pieza
}
// Función para fusionar la pieza actual con el tablero
function merge() {
  // Implementa la lógica para fusionar la pieza con el tablero
}

// Función para verificar y eliminar líneas completas
function clearLines() {
  // Implementa la lógica para verificar y eliminar líneas completas
}
function update() {
  // Actualiza la posición de la pieza actual
  // Verifica colisiones
  // Fusiona la pieza con el tablero si es necesario
  // Elimina líneas completas
  // Solicita la próxima pieza
}
