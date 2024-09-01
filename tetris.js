const canvas = document.getElementById('tetris-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const congratulationsBanner = document.getElementById('congratulations-banner');

let BLOCK_SIZE;
let ROWS;
let COLS;

let isPaused = false;
let currentTheme = 'rgb';

const pauseMenu = document.getElementById('pause-menu');
const settingsMenu = document.getElementById('settings-menu');
const resumeBtn = document.getElementById('resume-btn');
const settingsBtn = document.getElementById('settings-btn');
const backBtn = document.getElementById('back-btn');
const rgbTheme = document.getElementById('rgb-theme');
const darkTheme = document.getElementById('dark-theme');
const lightTheme = document.getElementById('light-theme');

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseMenu.style.display = 'block';
    } else {
        pauseMenu.style.display = 'none';
        settingsMenu.style.display = 'none';
    }
}

function showSettings() {
    pauseMenu.style.display = 'none';
    settingsMenu.style.display = 'block';
}

function hideSettings() {
    settingsMenu.style.display = 'none';
    pauseMenu.style.display = 'block';
}

function changeTheme(theme) {
    currentTheme = theme;
    document.body.className = theme === 'rgb' ? 'rgb-glow' : `${theme}-theme`;
}

resumeBtn.addEventListener('click', togglePause);
settingsBtn.addEventListener('click', showSettings);
backBtn.addEventListener('click', hideSettings);

rgbTheme.addEventListener('click', () => changeTheme('rgb'));
darkTheme.addEventListener('click', () => changeTheme('dark'));
lightTheme.addEventListener('click', () => changeTheme('light'));

function resizeGame() {
    const gameContainer = document.getElementById('game-container');
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;

    // Ajustar el tamaño del tablero para que ocupe el 80% de la altura disponible
    const boardHeight = Math.floor(containerHeight * 0.8);
    const boardWidth = Math.floor(boardHeight / 2);

    canvas.width = boardWidth;
    canvas.height = boardHeight;

    BLOCK_SIZE = Math.floor(boardHeight / 20);
    ROWS = Math.floor(boardHeight / BLOCK_SIZE);
    COLS = Math.floor(boardWidth / BLOCK_SIZE);

    // Reiniciar el juego con las nuevas dimensiones
    resetGame();
}

// Llamar a resizeGame cuando la ventana cambie de tamaño
window.addEventListener('resize', resizeGame);

const nextPieceCanvas = document.getElementById('next-piece-canvas');
const nextPieceCtx = nextPieceCanvas.getContext('2d');

let score = 0;

let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let currentFigure = null;
let currentColor = '';
let currentX = 0;
let currentY = 0;
let nextFigure = null;
let nextColor = '';

// Definimos los pesos para cada pieza
const PIECE_WEIGHTS = [
    1.11, // Pieza I (11% más probable)
    1,    // Pieza O
    1,    // Pieza Z
    1,    // Pieza S
    1,    // Pieza J
    1,    // Pieza L
    1     // Pieza T
];

// Calculamos la suma total de los pesos
const TOTAL_WEIGHT = PIECE_WEIGHTS.reduce((sum, weight) => sum + weight, 0);

function newFigure() {
    if (nextFigure === null) {
        // Si es la primera vez, generamos tanto la figura actual como la siguiente
        [currentFigure, currentColor] = getRandomFigure();
        [nextFigure, nextColor] = getRandomFigure();
    } else {
        // Si ya teníamos una figura siguiente, la usamos y generamos una nueva siguiente
        [currentFigure, currentColor] = [nextFigure, nextColor];
        [nextFigure, nextColor] = getRandomFigure();
    }
    
    currentX = Math.floor(COLS / 2) - Math.floor(currentFigure[0].length / 2);
    currentY = 0;
    
    drawNextPiece();
}

function getRandomFigure() {
    // Generamos un número aleatorio entre 0 y el peso total
    const randomWeight = Math.random() * TOTAL_WEIGHT;
    
    let weightSum = 0;
    let chosenIndex = 0;
    
    // Recorremos los pesos hasta encontrar la pieza seleccionada
    for (let i = 0; i < PIECE_WEIGHTS.length; i++) {
        weightSum += PIECE_WEIGHTS[i];
        if (randomWeight <= weightSum) {
            chosenIndex = i;
            break;
        }
    }
    
    return [FIGURES[chosenIndex].shape, FIGURES[chosenIndex].color];
}

function drawNextPiece() {
    nextPieceCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    
    const blockSize = 30;
    const offsetX = (nextPieceCanvas.width - nextFigure[0].length * blockSize) / 2;
    const offsetY = (nextPieceCanvas.height - nextFigure.length * blockSize) / 2;
    
    nextPieceCtx.fillStyle = nextColor;
    for (let y = 0; y < nextFigure.length; y++) {
        for (let x = 0; x < nextFigure[y].length; x++) {
            if (nextFigure[y][x]) {
                nextPieceCtx.fillRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
                nextPieceCtx.strokeStyle = 'black';
                nextPieceCtx.strokeRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar el tablero
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                ctx.fillStyle = board[y][x];  // Usar el color almacenado en el tablero
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
    
    // Dibujar la figura actual
    if (currentFigure) {
        ctx.fillStyle = currentColor;
        for (let y = 0; y < currentFigure.length; y++) {
            for (let x = 0; x < currentFigure[y].length; x++) {
                if (currentFigure[y][x]) {
                    ctx.fillRect((currentX + x) * BLOCK_SIZE, (currentY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.strokeStyle = 'black';
                    ctx.strokeRect((currentX + x) * BLOCK_SIZE, (currentY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }
}

function moveDown() {
    if (canMove(currentX, currentY + 1)) {
        currentY++;
    } else {
        freeze();
        clearLines();
        newFigure();
        if (!canMove(currentX, currentY)) {
            // Juego terminado
            alert('¡Juego terminado! Tu puntuación: ' + score);
            resetGame();
        }
    }
    draw();
}

function canMove(newX, newY, piece = currentFigure) {
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x]) {
                if (newY + y >= ROWS || newX + x < 0 || newX + x >= COLS || 
                    (newY + y >= 0 && board[newY + y][newX + x])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function freeze() {
    for (let y = 0; y < currentFigure.length; y++) {
        for (let x = 0; x < currentFigure[y].length; x++) {
            if (currentFigure[y][x]) {
                if (currentY + y >= 0 && currentY + y < ROWS && currentX + x >= 0 && currentX + x < COLS) {
                    board[currentY + y][currentX + x] = currentColor;
                }
            }
        }
    }
}

function clearLines() {
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            // Eliminar la línea completa
            board.splice(y, 1);
            // Añadir una nueva línea vacía en la parte superior
            board.unshift(Array(COLS).fill(0));
            // Incrementar el contador de líneas eliminadas
            linesCleared++;
            // Como hemos eliminado una línea, necesitamos revisar la misma y de nuevo
            y++;
        }
    }
    
    // Actualizar la puntuación basada en el número de líneas eliminadas
    if (linesCleared > 0) {
        updateScore(linesCleared * 100);
    }
}

function updateScore(points) {
    score += points;
    scoreElement.textContent = score;

    // Mostrar el banner cada 1000 puntos
    if (score % 1000 === 0 && score > 0) {
        showCongratulationsBanner();
    }
}

function showCongratulationsBanner() {
    congratulationsBanner.style.display = 'block';
    congratulationsBanner.style.opacity = '1';
    congratulationsBanner.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        congratulationsBanner.style.opacity = '0';
        setTimeout(() => {
            congratulationsBanner.style.display = 'none';
        }, 500);
    }, 2500);
}

function resetGame() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    score = 0;
    scoreElement.textContent = score;
    newFigure();
}

document.addEventListener('keydown', (e) => {
    if (!isPaused) {
        switch (e.key) {
            case 'ArrowLeft':
                if (canMove(currentX - 1, currentY)) {
                    currentX--;
                    draw();
                }
                break;
            case 'ArrowRight':
                if (canMove(currentX + 1, currentY)) {
                    currentX++;
                    draw();
                }
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowUp':
                tryRotate(1);  // Rotación en sentido horario
                break;
            case 'z':
            case 'Z':
                tryRotate(-1);  // Rotación en sentido antihorario
                break;
        }
    }
    if (e.key === 'Escape') {
        if (settingsMenu.style.display === 'block') {
            hideSettings();
        } else {
            togglePause();
        }
    }
});

function tryRotate(dir) {
    const rotated = rotate(currentFigure, dir);
    const kicks = getWallKicks(currentFigure, rotated);
    
    for (let [dx, dy] of kicks) {
        if (canMove(currentX + dx, currentY + dy, rotated)) {
            currentFigure = rotated;
            currentX += dx;
            currentY += dy;
            draw();
            return;
        }
    }
}

function rotate(matrix, dir) {
    const N = matrix.length;
    const M = matrix[0].length;
    const rotated = Array(M).fill().map(() => Array(N).fill(0));
    if (dir > 0) {  // Rotación en sentido horario
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < M; x++) {
                rotated[x][N - 1 - y] = matrix[y][x];
            }
        }
    } else {  // Rotación en sentido antihorario
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < M; x++) {
                rotated[M - 1 - x][y] = matrix[y][x];
            }
        }
    }
    return rotated;
}

function getWallKicks(oldPiece, newPiece) {
    // Implementa aquí la lógica de "wall kicks" según las reglas del Tetris moderno
    // Por ahora, usaremos una versión simplificada
    return [[0, 0], [-1, 0], [1, 0], [0, -1]];
}

function gameLoop() {
    if (!isPaused) {
        moveDown();
    }
    setTimeout(gameLoop, 1000);
}

// Asegúrate de llamar a resizeGame al inicio del juego
resizeGame();
gameLoop();
draw();

// Almacena el puntaje en una cookie
function setHighScore(score) {
    document.cookie = `highScore=${score}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

// Obtiene el puntaje más alto almacenado en la cookie
function getHighScore() {
    const cookie = document.cookie.split(';').find(cookie => cookie.includes('highScore'));
    if (cookie) {
        return parseInt(cookie.split('=')[1]);
    }
    return 0;
}

// Actualiza el puntaje más alto si es necesario
function updateHighScore(score) {
    const highScore = getHighScore();
    if (score > highScore) {
        setHighScore(score);
    }
}
