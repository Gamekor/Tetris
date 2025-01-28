const grid = document.getElementById('game-grid');
const rows = 20;
const cols = 10;

// Создание игрового поля
const cells = [];
for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
        row.push(cell);
    }
    cells.push(row);
}

// Параметры игры
const tetrominoes = [
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
];

let currentTetromino = [];
let position = { x: 3, y: 0 };
let gameOver = false;

// Функции для управления фигурой
function drawTetromino() {
    currentTetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                cells[position.y + y]?.[position.x + x]?.classList.add('active');
            }
        });
    });
}

function eraseTetromino() {
    currentTetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                cells[position.y + y]?.[position.x + x]?.classList.remove('active');
            }
        });
    });
}

function moveTetromino(dx, dy) {
    eraseTetromino();
    position.x += dx;
    position.y += dy;
    if (!isValidPosition()) {
        position.x -= dx;
        position.y -= dy;
    }
    drawTetromino();
}

function rotateTetromino() {
    eraseTetromino();
    const rotated = currentTetromino[0].map((_, i) =>
        currentTetromino.map(row => row[i]).reverse()
    );
    const oldTetromino = currentTetromino;
    currentTetromino = rotated;
    if (!isValidPosition()) {
        currentTetromino = oldTetromino;
    }
    drawTetromino();
}

function isValidPosition() {
    return currentTetromino.every((row, y) =>
        row.every((value, x) =>
            !value ||
            (cells[position.y + y] && cells[position.y + y][position.x + x] &&
                !cells[position.y + y][position.x + x].classList.contains('active'))
        )
    );
}

// Начало игры
function startGame() {
    currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    position = { x: 3, y: 0 };
    drawTetromino();
}

function dropTetromino() {
    moveTetromino(0, 1);
    if (!isValidPosition()) {
        currentTetromino.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    cells[position.y + y][position.x + x].classList.add('active');
                }
            });
        });
        startGame();
    }
    if (position.y === 0) {
        gameOver = true;
        alert('Игра окончена!');
    }
}

// Обработчики кнопок
document.getElementById('left').addEventListener('click', () => moveTetromino(-1, 0));
document.getElementById('right').addEventListener('click', () => moveTetromino(1, 0));
document.getElementById('down').addEventListener('click', () => dropTetromino());
document.getElementById('rotate').addEventListener('click', () => rotateTetromino());

// Автоматическое падение фигур
setInterval(() => {
    if (!gameOver) {
        dropTetromino();
    }
}, 1000);

// Начало игры
startGame();
