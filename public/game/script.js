const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 6;
const tileSize = 64;
const colors = ["red", "green", "blue", "yellow", "purple"];
let board = [];
let firstPick = null;
let score = 0;

document.body.insertAdjacentHTML('beforeend', `<div id="score">Score: 0</div>`);

canvas.width = gridSize * tileSize;
canvas.height = gridSize * tileSize;

function randColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function initBoard() {
    board = [];
    for (let y = 0; y < gridSize; y++) {
        board[y] = [];
        for (let x = 0; x < gridSize; x++) {
            board[y][x] = randColor();
        }
    }
}

function drawBoard() {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            ctx.fillStyle = board[y][x];
            ctx.fillRect(x * tileSize, y * tileSize, tileSize - 2, tileSize - 2);
        }
    }
}

canvas.addEventListener("click", function (e) {
    const x = Math.floor(e.offsetX / tileSize);
    const y = Math.floor(e.offsetY / tileSize);
    handleClick(x, y);
});

function handleClick(x, y) {
    if (!firstPick) {
        firstPick = { x, y };
    } else {
        const dx = Math.abs(firstPick.x - x);
        const dy = Math.abs(firstPick.y - y);
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            swap(firstPick.x, firstPick.y, x, y);
            if (checkMatches()) {
                score += 10;
                updateScore();
                sendScore();
            } else {
                swap(firstPick.x, firstPick.y, x, y); // undo
            }
        }
        firstPick = null;
    }
    drawBoard();
}

function swap(x1, y1, x2, y2) {
    const temp = board[y1][x1];
    board[y1][x1] = board[y2][x2];
    board[y2][x2] = temp;
}

function checkMatches() {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize - 2; x++) {
            if (
                board[y][x] === board[y][x + 1] &&
                board[y][x] === board[y][x + 2]
            ) return true;
        }
    }
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize - 2; y++) {
            if (
                board[y][x] === board[y + 1][x] &&
                board[y][x] === board[y + 2][x]
            ) return true;
        }
    }
    return false;
}

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}

function sendScore() {
    fetch("http://127.0.0.1:8000/api/score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            player_name: "Guest",
            score: score,
        }),
    });
}

initBoard();
drawBoard();
