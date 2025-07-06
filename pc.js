// Nine Men's Morris game logic
let board = {}; // maps position index to occupant ('R', 'B', or '')
let currentPlayer = 'R'; // 'R' for Red, 'B' for Blue
let redScore = 0, blueScore = 0;
let phase = 1; // 1 = placing phase, 2 = moving phase
let piecesToPlace = { 'R': 9, 'B': 9 };
let millFormed = false;
let removalMode = false;
let selectSource; // for moving phase

// Define neighbors for movement
const neighbors = {
    0: [1,9], 1: [0,2,4], 2: [1,14],
    3: [4,10], 4: [1,3,5,7], 5: [4,13],
    6: [7,11], 7: [4,6,8], 8: [7,12],
    9: [0,10,21], 10: [3,9,11,18], 11: [6,10,15],
    12: [8,13,17], 13: [5,12,14,20], 14: [2,13,23],
    15: [11,16], 16: [15,17,19], 17: [12,16],
    18: [10,19], 19: [16,18,20,22], 20: [13,19],
    21: [9,22], 22: [19,21,23], 23: [14,22]
};
// Define all possible mills (triplets)
const mills = [
    [0,1,2], [3,4,5], [6,7,8], [9,10,11],
    [12,13,14], [15,16,17], [18,19,20], [21,22,23],
    [0,9,21], [3,10,18], [6,11,15], [2,14,23],
    [5,13,20], [8,12,17]
];

// Setup board cells in HTML
function createBoard() {
    const boardElem = document.getElementById('board');
    // Allowed cell positions in a 7x7 grid
    const validCells = {
        0: [1,1], 1: [1,4], 2: [1,7],
        3: [2,2], 4: [2,4], 5: [2,6],
        6: [3,3], 7: [3,4], 8: [3,5],
        9: [4,1], 10: [4,2], 11: [4,3],
        12: [4,5], 13: [4,6], 14: [4,7],
        15: [5,3], 16: [5,4], 17: [5,5],
        18: [6,2], 19: [6,4], 20: [6,6],
        21: [7,1], 22: [7,4], 23: [7,7]
    };
    // Create 7x7 grid cells
    for (let r = 1; r <= 7; r++) {
        for (let c = 1; c <= 7; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.gridRow = r;
            cell.style.gridColumn = c;
            // If (r,c) is in validCells, make it a point
            for (const idx in validCells) {
                if (validCells[idx][0] === r && validCells[idx][1] === c) {
                    cell.id = 'point' + idx;
                    cell.classList.add('point');
                    cell.addEventListener('click', cellClicked);
                    cell.addEventListener('dragover', dragOver);
                    cell.addEventListener('drop', dropPiece);
                    const spot = document.createElement('div');
                    spot.classList.add('spot');
                    cell.appendChild(spot);
                    board[idx] = '';
                    break;
                }
            }
            boardElem.appendChild(cell);
        }
    }
}

function updateStatus() {
    document.getElementById('turnIndicator').textContent = 
        'Turn: ' + (currentPlayer === 'R' ? 'Red' : 'Blue');
    document.getElementById('scoreboard').textContent = 
        'Score - Red: ' + redScore + ', Blue: ' + blueScore;
}

// Check if move is a valid neighbor move
function isNeighbor(from, to) {
    return neighbors[from] && neighbors[from].includes(to);
}

// Check if placing/moving to a position forms a mill
function checkMill(pos, player) {
    return mills.some(triplet => 
        triplet.includes(pos) && triplet.every(idx => board[idx] === player)
    );
}

// Get opponent's pieces that can be removed (not in a mill)
// If all in mills, allow any opponent piece
function getRemovablePieces(opponent) {
    let removable = [];
    for (const pos in board) {
        if (board[pos] === opponent) {
            const inMill = mills.some(triplet =>
                triplet.includes(parseInt(pos)) && triplet.every(idx => board[idx] === opponent)
            );
            if (!inMill) {
                removable.push(parseInt(pos));
            }
        }
    }
    if (removable.length === 0) {
        for (const pos in board) {
            if (board[pos] === opponent) removable.push(parseInt(pos));
        }
    }
    return removable;
}

function highlightRemovable(removable) {
    removable.forEach(pos => {
        const cell = document.getElementById('point' + pos);
        const piece = cell.querySelector('.piece');
        if (piece) piece.classList.add('dancing');
    });
}

function clearHighlights() {
    document.querySelectorAll('.piece').forEach(p => {
        p.classList.remove('dancing');
    });
}

function cellClicked(e) {
    const cellId = this.id; // e.g. "point5"
    const index = parseInt(cellId.replace('point', ''), 10);
    if (removalMode) {
        // If in removal mode, allow removing an opponent piece
        if (board[index] === (currentPlayer === 'R' ? 'B' : 'R')) {
            removePiece(index);
            removalMode = false;
            clearHighlights();
            nextTurn();
        }
        return;
    }
    if (phase === 1) {
        // Placing phase
        if (!board[index] && piecesToPlace[currentPlayer] > 0) {
            placePiece(index, currentPlayer);
            piecesToPlace[currentPlayer]--;
            // Check for mill
            if (checkMill(index, currentPlayer)) {
                const opponent = currentPlayer === 'R' ? 'B' : 'R';
                let toRemove = getRemovablePieces(opponent);
                highlightRemovable(toRemove);
                removalMode = true;
                return;
            }
            nextTurn();
            if (piecesToPlace['R'] === 0 && piecesToPlace['B'] === 0) {
                phase = 2;
            }
        }
    } else {
        // Moving phase (click-to-move)
        if (this.querySelector('.piece') && board[index] === currentPlayer) {
            // Select own piece
            selectSource = index;
        } else if (typeof selectSource !== 'undefined') {
            // Attempt to move from selectSource to this index
            const src = selectSource;
            delete selectSource;
            if (!board[index] && isNeighbor(src, index)) {
                movePiece(src, index);
                // Check for mill
                if (checkMill(index, currentPlayer)) {
                    const opponent = currentPlayer === 'R' ? 'B' : 'R';
                    let toRemove = getRemovablePieces(opponent);
                    highlightRemovable(toRemove);
                    removalMode = true;
                    return;
                }
                nextTurn();
            }
        }
    }
}

function placePiece(index, player) {
    board[index] = player;
    const cell = document.getElementById('point' + index);
    const piece = document.createElement('div');
    piece.classList.add('piece', player === 'R' ? 'red' : 'blue');
    piece.setAttribute('draggable', 'true');
    piece.addEventListener('dragstart', dragStart);
    const circle = document.createElement('div');
    circle.classList.add('piece-circle');
    piece.appendChild(circle);
    cell.appendChild(piece);
    updateStatus();
}

function movePiece(src, dst) {
    const piece = document.getElementById('point' + src).querySelector('.piece');
    board[dst] = board[src];
    board[src] = '';
    document.getElementById('point' + dst).appendChild(piece);
    updateStatus();
}

function removePiece(index) {
    const cell = document.getElementById('point' + index);
    const piece = cell.querySelector('.piece');
    if (piece) cell.removeChild(piece);
    const removed = board[index];
    board[index] = '';
    if (removed === 'R') {
        blueScore++;
    } else if (removed === 'B') {
        redScore++;
    }
    updateStatus();
    // Check for winner
    if (redScore >= 5 || blueScore >= 5) {
        setTimeout(() => {
            if (redScore >= 5) {
                alert('Blue wins!');
            } else {
                alert('Red wins!');
            }
            location.reload();
        }, 100);
    }
}

function nextTurn() {
    currentPlayer = currentPlayer === 'R' ? 'B' : 'R';
    updateStatus();
}

function dragStart(e) {
    const piece = e.target;
    const cell = piece.parentNode;
    e.dataTransfer.setData('text/plain', cell.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dropPiece(e) {
    e.preventDefault();
    const srcId = e.dataTransfer.getData('text/plain');
    const dstCell = e.currentTarget;
    if (removalMode || phase === 1) return;
    if (srcId && dstCell.id) {
        const srcIndex = parseInt(srcId.replace('point', ''), 10);
        const dstIndex = parseInt(dstCell.id.replace('point', ''), 10);
        if (board[srcIndex] === currentPlayer && board[dstIndex] === '' 
            && isNeighbor(srcIndex, dstIndex)) {
            movePiece(srcIndex, dstIndex);
            if (checkMill(dstIndex, currentPlayer)) {
                const opponent = currentPlayer === 'R' ? 'B' : 'R';
                let toRemove = getRemovablePieces(opponent);
                highlightRemovable(toRemove);
                removalMode = true;
            } else {
                nextTurn();
            }
        }
    }
}

// Initialize game
createBoard();
updateStatus();
