// Canvas setup
const canvas = document.getElementById('gameCanvas');
const playAgainBtn = document.getElementById('play-again-button');
const upButton = document.getElementById('mc-up');
const downButton = document.getElementById('mc-down');
const leftButton = document.getElementById('mc-left');
const rightButton = document.getElementById('mc-right');
const stopButton = document.getElementById('mc-stop');
const controls = document.getElementById('controls')

const ctx = canvas.getContext('2d');
canvas.width = 450;
canvas.height = 450;

// Nut class
class Nut {
    constructor(x, y, nutImgs) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.images = nutImgs;
        this.imgIndex = 0;
        this.animationCounter = 0;
        this.currentImgs = this.images; // Initialize currentImgs for animation
    }

    updateImage() {
        this.animationCounter++;
        if (this.animationCounter >= 10) {
            this.imgIndex = (this.imgIndex + 1) % this.images.length;
            this.animationCounter = 0;
        }
        this.image = this.currentImgs[this.imgIndex];
    }

    display(ctx) {
        this.updateImage();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Player class
class Player {
    constructor(x, y, standingImgs, upImgs, downImgs, leftImgs, rightImgs) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.standingImgs = standingImgs;
        this.upImgs = upImgs;
        this.downImgs = downImgs;
        this.leftImgs = leftImgs;
        this.rightImgs = rightImgs;
        this.image = standingImgs[0];
        this.imgIndex = 0;
        this.animationCounter = 0;
        this.isFrozen = false;
        this.score = 0;
    }

    updateImage() {
        if (!this.isFrozen) {
            this.animationCounter++;
            if (this.animationCounter >= 10) {
                this.imgIndex = (this.imgIndex + 1) % 2;
                this.animationCounter = 0;
            }
            this.image = this.currentImgs[this.imgIndex];
        }
    }

    standStill() {
        this.currentImgs = this.standingImgs;
    }

    moveUp() {
        if (!this.isFrozen) {
            this.currentImgs = this.upImgs;
        }
    }

    moveDown() {
        if (!this.isFrozen) {
            this.currentImgs = this.downImgs;
        }
    }

    moveLeft() {
        if (!this.isFrozen) {
            this.currentImgs = this.leftImgs;
        }
    }

    moveRight() {
        if (!this.isFrozen) {
            this.currentImgs = this.rightImgs;
        }
    }

    freeze() {
        this.isFrozen = true;
    }

    unfreeze() {
        this.isFrozen = false;
    }
}

// Circle class
class Circle {
    constructor(type, x, y) {
        this.x = x;
        this.y = y;
        this.radius = 50;
        this.type = type;
        this.speed = 4;
        this.dir = 1;
    }

    displayCircle(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.fill();
        ctx.closePath();

        // Move the circle depending on its type
        if (this.type === 'a') {
            this.x += this.speed * this.dir;
            if (this.x > canvas.width - this.radius || this.x < this.radius) {
                this.dir *= -1;
            }
        }
        if (this.type === 'b') {
            this.y += this.speed * this.dir;
            if (this.y > canvas.height - this.radius || this.y < this.radius) {
                this.dir *= -1;
            }
        }
    }

    checkCollision(player) {
        const distX = player.x - this.x;
        const distY = player.y - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance < this.radius + player.width / 2;
    }
}

// Poop class
class Poop {
    constructor(x, y, type, images) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 50; // Width of the poop image
        this.height = 50; // Height of the poop image
        this.images = images; // Array of poop images
        this.imgIndex = Math.floor(Math.random() * this.images.length); // Randomly select one image
    }

    display(ctx) {
        ctx.drawImage(this.images[this.imgIndex], this.x, this.y, this.width, this.height);
    }
}

// Bar class for displaying detection
class Bar {
    constructor(x, y, width, height, maxValue, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxValue = maxValue;
        this.value = maxValue;
        this.color = color;
    }

    displayFreezeBar(ctx, value) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        const filledWidth = (value / this.maxValue) * this.width;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, filledWidth, this.height);
    }
}

// Load sound effects
const poopSound = new Audio('/static/hammy_stop/audio/poop.mp3');
const eatSound = new Audio('/static/hammy_stop/audio/nut.mp3');
const bgm = new Audio('/static/hammy_stop/audio/bgm.mp3');
const alert = new Audio('/static/hammy_stop/audio/alert.mp3');


// Setup images
const standingImgs = [new Image(), new Image()];
standingImgs[0].src = '/static/hammy_stop/images/s1.png';
standingImgs[1].src = '/static/hammy_stop/images/s2.png';
const upImgs = [new Image(), new Image()];
upImgs[0].src = '/static/hammy_stop/images/um1.png';
upImgs[1].src = '/static/hammy_stop/images/um2.png';
const downImgs = [new Image(), new Image()];
downImgs[0].src = '/static/hammy_stop/images/dm1.png';
downImgs[1].src = '/static/hammy_stop/images/dm2.png';
const leftImgs = [new Image(), new Image()];
leftImgs[0].src = '/static/hammy_stop/images/lm1.png';
leftImgs[1].src = '/static/hammy_stop/images/lm2.png';
const rightImgs = [new Image(), new Image()];
rightImgs[0].src = '/static/hammy_stop/images/rm1.png';
rightImgs[1].src = '/static/hammy_stop/images/rm2.png';
const nutImgs = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
nutImgs[0].src = '/static/hammy_stop/images/n1.png';
nutImgs[1].src = '/static/hammy_stop/images/n2.png';
nutImgs[2].src = '/static/hammy_stop/images/n3.png';
nutImgs[3].src = '/static/hammy_stop/images/n4.png';
nutImgs[4].src = '/static/hammy_stop/images/n5.png';
nutImgs[5].src = '/static/hammy_stop/images/n6.png';
nutImgs[6].src = '/static/hammy_stop/images/n7.png';
nutImgs[7].src = '/static/hammy_stop/images/n8.png';
// Setup poop images
const poopImgs = [new Image(), new Image(), new Image()];
poopImgs[0].src = '/static/hammy_stop/images/p1.png';
poopImgs[1].src = '/static/hammy_stop/images/p2.png';
poopImgs[2].src = '/static/hammy_stop/images/p3.png';


// Create player, circles, nuts, and bar
const player = new Player(100, 100, standingImgs, upImgs, downImgs, leftImgs, rightImgs);
const circles = [new Circle('a', 200, 200)];
const nuts = [];
const poops = [];
const detectionBar = new Bar(20, 10, 400, 30, 100, 'green');
let gameOver = false;
let scoreSaved = false; 

let moveDirection = null; // Track the current direction



upButton.addEventListener('touchstart', () => { moveDirection = 'up'; });
upButton.addEventListener('mousedown', () => { moveDirection = 'up'; });
downButton.addEventListener('touchstart', () => { moveDirection = 'down'; });
downButton.addEventListener('mousedown', () => { moveDirection = 'down'; });
leftButton.addEventListener('touchstart', () => { moveDirection = 'left'; });
leftButton.addEventListener('mousedown', () => { moveDirection = 'left'; });
rightButton.addEventListener('touchstart', () => { moveDirection = 'right'; });
rightButton.addEventListener('mousedown', () => { moveDirection = 'right'; });
stopButton.addEventListener('touchstart', stopMovement);
stopButton.addEventListener('mousedown', stopMovement);

window.addEventListener('touchend', () => { moveDirection = null; });
window.addEventListener('mouseup', () => { moveDirection = null; });


function moveUp() {
    if (!player.isFrozen && player.y > 0) {
        player.y -= 5;
        player.moveUp();
    }
}

function moveDown() {
    if (!player.isFrozen && player.y < 400) {
        player.y += 5;
        player.moveDown();
    }
}

function moveLeft() {
    if (!player.isFrozen && player.x > 0) {
        player.x -= 5;
        player.moveLeft();
    }
}

function moveRight() {
    if (!player.isFrozen && player.x < 400) {
        player.x += 5;
        player.moveRight();
    }
}

function stopMovement() {
    player.standStill();
}


// Handle input
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        player.freeze();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === ' ') {
        player.unfreeze();
    }
});

// Function to spawn nuts
function spawnNut() {
    const x = Math.random() * (canvas.width - 50); // Ensure nut stays within canvas bounds
    const y = Math.random() * (canvas.height - 50);
    nuts.push(new Nut(x, y, nutImgs));
}

function spawnCircle() {
    const x = Math.random() * (canvas.width - 50); // Ensure the circle stays within canvas bounds
    const y = Math.random() * (canvas.height - 50);
    // Randomly select type 'a' or 'b'
    const type = Math.random() < 0.5 ? 'a' : 'b'; // 50% chance for either type
    circles.push(new Circle(type, x, y));
}

function spawnPoop() {
    const x = player.x;
    const y = player.y;
    const style = Math.random();
    let type;
    if (style < 0.3) {
        type = 'a';
    } else if (style < 0.7) {
        type = 'b';
    } else {
        type = 'c';
    }
    poops.push(new Poop(x, y, type, poopImgs)); // Pass the loaded poop images
    poopSound.play();
}

function displayScore() {
    ctx.fillStyle = 'white'; // Color for the score text
    ctx.font = '20px Arial'; // Font style and size
    ctx.fillText(`Nuts: ${player.score}`, 200, 440); // Display the score at (20, 40)
    ctx.fillText('DETECTION', 20, 30); // Display detction Text
}

function detectionDrip() {
    detectionBar.value--;
}

function displayGameOverMessage(score) {
    ctx.fillStyle = 'white';
    ctx.font = '36px serif';
    ctx.fillText(`Nuts: ${player.score}`, canvas.width / 2 - 150, canvas.height / 2 - 50);
    saveScore(score)

}

// Spawn nuts and circles
setInterval(spawnNut, Math.random() * 2000 + 2000); // Random interval between 2s and 5s
setInterval(spawnCircle, Math.random() * 20000 + 10000); // Random interval between 20s and 40s
setInterval(spawnPoop, Math.random() * 20000 + 10000); // Random interval between 20s and 50s
setInterval(detectionDrip, 1000);

function resetGame() {
    player.score = 0; // Reset score
    player.x = 100; // Reset player position
    player.y = 100; // Reset player position
    circles.length = 0; // Clear circles array
    circles.push(new Circle('a', 200, 200)); // Add initial circle
    nuts.length = 0; // Clear nuts array
    poops.length = 0; // Clear poops array
    detectionBar.value = detectionBar.maxValue; // Reset bar value
    gameOver = false; // Reset game over status

    gameLoop();
}

async function saveScore(score) {
    try {
        const response = await fetch('/hammy_stop/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({ 'score': score }),
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get the error message
            console.error(`HTTP error! Status: ${response.status} - ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Score saved successfully:', data);
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// Function to get CSRF token (required if you have CSRF protection enabled)
function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken'))
        ?.split('=')[1];
    return cookieValue || '';
}

bgm.loop = true;
bgm.play();

// Game loop
function gameLoop() {
    if (gameOver) {
        if (!scoreSaved) {
            scoreSaved = true; // Set flag to avoid multiple saves
        }
        displayGameOverMessage(player.score);
        playAgainBtn.classList.remove('hidden');
        playAgainBtn.classList.add('visible');
        controls.classList.remove('visible');
        controls.classList.add('hidden');
        playAgainBtn.onclick = function() {
            scoreSaved = false; // Reset score save flag
            resetGame();
            playAgainBtn.classList.remove('visible');
            playAgainBtn.classList.add('hidden');
            controls.classList.remove('hidden');
            controls.classList.add('visible');
        };
        return; // Exit the loop early if the game is over
    }

    ctx.fillStyle = 'darkblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!player.isFrozen) {
        if (keys['ArrowUp'] || moveDirection === 'up') {
            if (player.y > 0) {
                player.y -= 5;
                player.moveUp();
            }
        }
        if (keys['ArrowDown'] || moveDirection === 'down') {
            if (player.y < canvas.height - player.height) {
                player.y += 5;
                player.moveDown();
            }
        }
        if (keys['ArrowLeft'] || moveDirection === 'left') {
            if (player.x > 0) {
                player.x -= 5;
                player.moveLeft();
            }
        }
        if (keys['ArrowRight'] || moveDirection === 'right') {
            if (player.x < canvas.width - player.width) {
                player.x += 5;
                player.moveRight();
            }
        }

        // Stop the player if no direction is pressed
        if (!keys['ArrowUp'] && !keys['ArrowDown'] && !keys['ArrowLeft'] && !keys['ArrowRight'] && !moveDirection) {
            player.standStill();
        }
    }

    // Update and draw nuts
    nuts.forEach(nut => {
        nut.display(ctx);
        // Optional: check for collisions with the player to collect nuts
        if (nut.x < player.x + player.width && nut.x + nut.width > player.x && 
            nut.y < player.y + player.height && nut.y + nut.height > player.y) {
            // Handle collecting nut
            nuts.splice(nuts.indexOf(nut), 1); // Remove the nut from the array
            if (detectionBar.value < 90) {
                detectionBar.value += 10;
                
            }
            else {
                detectionBar.value = 100;
            }
            player.score++;
            eatSound.play();
            // You can also increase the score or perform any other action here
        }
    });

    // Update and draw poops
    poops.forEach(poop => {
        poop.display(ctx);
    });

    // Update and draw the player
    player.updateImage();
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

    // Update and draw circles
    circles.forEach(circle => {
        circle.displayCircle(ctx);
        if (circle.checkCollision(player) && !player.isFrozen) {
            detectionBar.value -= 0.5;
        }
    });

    if (detectionBar.value <= 0) {
        gameOver = true;
    }

    // Display the detection bar
    detectionBar.displayFreezeBar(ctx, detectionBar.value);
    displayScore();

    requestAnimationFrame(gameLoop);
}

gameLoop();

