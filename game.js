// Constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const CELL_SIZE = 20; // Adjust cell size for desired grid density
const BG_COLOR = '#f0f0f0';
const PLAYER_COLOR = '#0cc757';
const ENEMY_COLOR = '#fb330a'; // Enemy color
const ATOM_COLOR = '#44da06';
const BLOCK_COLOR = '#333'; // Changed block color

// Game variables
let canvas, ctx;
let playerX, playerY;
let atomX, atomY;
let score;
let blocks = []; // Array to store block positions
let enemies = []; // Array to store enemy positions

// Define the maze structure (example)
const maze = [
    '####################',
    '#   #        #     #',
    '# # # ### ## #   ## ',
    '# #   #   #       #',
    '# ##### # ### # ###',
    '#       #   # #    ',
    '####### ### # ### #',
    '#       #   #      #',
    '####################'
];

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Calculate grid dimensions based on maze structure
    const mazeWidth = maze[0].length;
    const mazeHeight = maze.length;
    
    // Adjust cell size to fit maze within canvas
    const calculatedCellSize = Math.min(CANVAS_WIDTH / mazeWidth, CANVAS_HEIGHT / mazeHeight);
    
    // Adjust player and atom positions based on calculated cell size
    playerX = Math.floor(mazeWidth / 2);
    playerY = Math.floor(mazeHeight / 2);
    score = 0;
    
    spawnAtom();
    createBlocks();
    spawnEnemies(); // Spawn initial enemies
    
    document.addEventListener('keydown', handleKeyPress);
    
    // Start the game loop
    setInterval(gameLoop, 100); // Adjust speed here (lower value for faster game)
}

// Spawn a new atom at a random position
function spawnAtom() {
    do {
        atomX = Math.floor(Math.random() * maze[0].length);
        atomY = Math.floor(Math.random() * maze.length);
    } while (isBlock(atomX, atomY) || isEnemy(atomX, atomY)); // Ensure atom doesn't spawn on a block or enemy
}

// Create blocks based on the maze structure
function createBlocks() {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === '#') {
                blocks.push({ x: x, y: y });
            }
        }
    }
}

// Spawn enemies at random positions
function spawnEnemies() {
    for (let i = 0; i < 3; i++) { // Adjust number of enemies as needed
        let enemyX, enemyY;
        do {
            enemyX = Math.floor(Math.random() * maze[0].length);
            enemyY = Math.floor(Math.random() * maze.length);
        } while (isBlock(enemyX, enemyY)); // Ensure enemy doesn't spawn on a block
        
        enemies.push({ x: enemyX, y: enemyY });
    }
}

// Check if the given position is a block
function isBlock(x, y) {
    return blocks.some(block => block.x === x && block.y === y);
}

// Check if the given position is occupied by an enemy
function isEnemy(x, y) {
    return enemies.some(enemy => enemy.x === x && enemy.y === y);
}

// Handle player input
function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
}

// Move the player
function movePlayer(dx, dy) {
    const newPlayerX = playerX + dx;
    const newPlayerY = playerY + dy;
    
    // Check boundaries and blocks
    if (newPlayerX >= 0 && newPlayerX < maze[0].length && newPlayerY >= 0 && newPlayerY < maze.length && !isBlock(newPlayerX, newPlayerY)) {
        playerX = newPlayerX;
        playerY = newPlayerY;
        
        // Check if player collected an atom
        if (playerX === atomX && playerY === atomY) {
            score++;
            spawnAtom();
        }
        
        // Check for collision with enemies
        checkEnemyCollision();
    }
}

// Check collision with enemies
function checkEnemyCollision() {
    for (let i = 0; i < enemies.length; i++) {
        if (playerX === enemies[i].x && playerY === enemies[i].y) {
            // Game over scenario (reset game state, or handle as needed)
            resetGame();
            break;
        }
    }
}

// Reset game state
function resetGame() {
    playerX = Math.floor(maze[0].length / 2);
    playerY = Math.floor(maze.length / 2);
    score = 0;
    spawnAtom();
    enemies = [];
    spawnEnemies();
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw blocks (maze walls)
    ctx.fillStyle = BLOCK_COLOR;
    blocks.forEach(block => {
        ctx.fillRect(block.x * CELL_SIZE, block.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    
    // Draw player
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(playerX * CELL_SIZE, playerY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    // Draw atom
    ctx.fillStyle = ATOM_COLOR;
    ctx.fillRect(atomX * CELL_SIZE, atomY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    // Draw enemies
    ctx.fillStyle = ENEMY_COLOR;
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x * CELL_SIZE, enemy.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    
    // Display score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Initialize the game when the window loads
window.onload = function() {
    init();
};
