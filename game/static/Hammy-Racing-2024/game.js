const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const carImage = new Image();
carImage.src = '/static/Hammy-Racing-2024/redCar1.png'; // Replace with the path to your car image

const background = new Image();
background.src = '/static/Hammy-Racing-2024/floor.jpg'; // Replace with the path to your background image

const obstacleImage1 = new Image();
obstacleImage1.src = '/static/Hammy-Racing-2024/pencil.png'; // Replace with the path to your first obstacle image

const obstacleImage2 = new Image();
obstacleImage2.src = '/static/Hammy-Racing-2024/coins.png'; // Replace with the path to your second obstacle image

const finishLineImage = new Image();
finishLineImage.src = '/static/Hammy-Racing-2024/finish.png'; // Replace with the path to your second obstacle image


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    restartGame(); // Optional: restart to reposition car, etc.
});

let car = {
    x: 20,
    y: canvas.height / 2,
    width: 75,
    height: 40,
    speed: 3,
    dy: 0
};

let obstacles = [];
let baseSpeed = 3;
let speedFactor = 2.5;
let isSlowedDown = false;
let bgX = 0;
let tilesPassed = 0;
let startTime;
let gameOver = false;

function saveTime(timeTaken) {
    fetch('/hammy_racing/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ 'time': timeTaken.toFixed(2) }),  // Use timeTaken here
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to get CSRF token (required if you have CSRF protection enabled)
function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken'))
        ?.split('=')[1];
    return cookieValue || '';
}

function drawBackground() {
    ctx.drawImage(background, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(background, bgX + canvas.width, 0, canvas.width, canvas.height);

    bgX -= baseSpeed * speedFactor;
    if (bgX <= -canvas.width) {
        bgX = 0;
        tilesPassed++;
    }
}

function drawCar() {
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        let obstacleImage;
        if (obstacle.type === 'finish') {
            obstacleImage = finishLineImage;
        } else {
            obstacleImage = obstacle.type === 1 ? obstacleImage1 : obstacleImage2;
        }
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= baseSpeed * speedFactor;
    });

    if (obstacles.length && obstacles[0].x < -obstacles[0].width) {
        obstacles.shift();
    }

    if (tilesPassed >= 20 && !obstacles.some(ob => ob.type === 'finish')) {
        obstacles.push({
            x: canvas.width,
            y: 0,
            width: 50,
            height: canvas.height,
            type: 'finish'
        });
    }

    if (Math.random() < 0.02 && tilesPassed < 20) {
        let type = Math.random() < 0.5 ? 1 : 2;
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 60),
            width: type === 1 ? 30 : 100,
            height: type === 1 ? 350 : 100,
            type: type
        });
    }
}

function detectCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y) {
            if (obstacle.type === 'finish') {
                gameOver = true;
                const timeTaken = (Date.now() - startTime) / 1000;
                displayGameOverMessage(timeTaken);
                return;
            } else {
                isSlowedDown = true;
                return;
            }
        }
    }
    isSlowedDown = false;
}

function displayGameOverMessage(timeTaken) {
    ctx.fillStyle = 'black';
    ctx.font = '48px serif';
    ctx.fillText(`Time: ${timeTaken.toFixed(2)} seconds`, canvas.width / 2 - 150, canvas.height / 2 - 50);
    saveTime(timeTaken);  // Pass the timeTaken to the saveTime function
    ctx.fillText(`Finished!`, canvas.width / 2 - 150, canvas.height / 2 - 50);
}


function drawTimer() {
    const currentTime = (Date.now() - startTime) / 1000;
    ctx.fillStyle = 'black';
    ctx.font = '24px serif';
    ctx.fillText(`Time: ${currentTime.toFixed(2)} seconds`, 10, 30);
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    car.y += car.dy;
    if (car.y < 0) car.y = 0;
    if (car.y + car.height > canvas.height) car.y = canvas.height - car.height;

    updateObstacles();
    drawObstacles();
    drawCar();
    drawTimer();
    detectCollision();

    speedFactor = isSlowedDown ? 0.4 : 2.5;

    requestAnimationFrame(update);
}

function restartGame() {
    car = {
        x: 20,
        y: canvas.height / 2,
        width: 75,
        height: 40,
        speed: 3,
        dy: 0
    };

    obstacles = [];
    baseSpeed = 3;
    speedFactor = 2.5;
    isSlowedDown = false;
    bgX = 0;
    tilesPassed = 0;
    gameOver = false;
    startTime = Date.now();
    update();
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') car.dy = -car.speed;
    if (e.key === 'ArrowDown') car.dy = car.speed;
    if (e.key === ' ') {
        if (gameOver) restartGame();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') car.dy = 0;
});

window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchend', handleTouchEnd);

function handleTouchStart(e) {
    // Get the touch position relative to the canvas
    const touchY = e.touches[0].clientY;

    // Move the car up if the touch is above the car's y position
    if (touchY < car.y) {
        car.dy = -car.speed;
    }
    // Move the car down if the touch is below the car's y position
    else if (touchY > car.y + car.height) {
        car.dy = car.speed;
    }
}

function handleTouchEnd() {
    // If the game is over, restart the game on touch end
    if (gameOver) {
        restartGame();
    } else {
        // Stop the car's movement when the touch ends
        car.dy = 0;
    }
}

background.onload = function() {
    startTime = Date.now();
    update();
};

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
