const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const gridSize = 20;
        const cellSize = 20;

        canvas.width = gridSize * cellSize;
        canvas.height = gridSize * cellSize;

        let snake, direction, food, score, gameOver, speed, obstacles;

        function initializeGame() {
            snake = [{ x: 10, y: 10 }];
            direction = 'right';
            food = spawnFood();
            score = 0;
            gameOver = false;
            speed = 200; // Initial speed
            obstacles = generateObstacles();
            gameLoop();
        }

        function spawnFood() {
            let foodPosition;
            do {
                foodPosition = {
                    x: Math.floor(Math.random() * gridSize),
                    y: Math.floor(Math.random() * gridSize)
                };
            } while (isPositionOccupied(foodPosition));
            return foodPosition;
        }

        function generateObstacles() {
            const numObstacles = 10;
            const obstaclePositions = [];
            for (let i = 0; i < numObstacles; i++) {
                let obstacle;
                do {
                    obstacle = {
                        x: Math.floor(Math.random() * gridSize),
                        y: Math.floor(Math.random() * gridSize)
                    };
                } while (isPositionOccupied(obstacle));
                obstaclePositions.push(obstacle);
            }
            return obstaclePositions;
        }

        function isPositionOccupied(position) {
            return (
                snake.some(segment => segment.x === position.x && segment.y === position.y) ||
                obstacles?.some(obstacle => obstacle.x === position.x && obstacle.y === position.y)
            );
        }

        function drawGrid() {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawSnake() {
            ctx.fillStyle = '#00ff00';
            snake.forEach(segment => {
                ctx.fillRect(
                    segment.x * cellSize,
                    segment.y * cellSize,
                    cellSize - 1,
                    cellSize - 1
                );
            });
        }

        function drawFood() {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(
                food.x * cellSize,
                food.y * cellSize,
                cellSize - 1,
                cellSize - 1
            );
        }

        function drawObstacles() {
            ctx.fillStyle = '#646cff';
            obstacles.forEach(obstacle => {
                ctx.fillRect(
                    obstacle.x * cellSize,
                    obstacle.y * cellSize,
                    cellSize - 1,
                    cellSize - 1
                );
            });
        }

        function drawScore() {
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, 10, 20);
            ctx.fillText(`Level: ${Math.ceil(score / 20)}`, 10, 40);
        }

        function moveSnake() {
            const head = { ...snake[0] };

            switch (direction) {
                case 'up': head.y--; break;
                case 'down': head.y++; break;
                case 'left': head.x--; break;
                case 'right': head.x++; break;
            }

            snake.unshift(head);

            // Check if snake eats the food
            if (head.x === food.x && head.y === food.y) {
                food = spawnFood();
                score += 10;
                increaseDifficulty();
            } else {
                snake.pop();
            }

            // Check for collisions
            if (
                head.x < 0 || head.x >= gridSize ||
                head.y < 0 || head.y >= gridSize ||
                snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) ||
                obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)
            ) {
                gameOver = true;
            }
        }

        function increaseDifficulty() {
            if (speed > 50) { // Minimum speed limit
                speed -= 5; // Increase difficulty by decreasing the interval
            }
        }

        function gameLoop() {
            if (gameOver) {
                drawGameOver();
                return;
            }

            drawGrid();
            moveSnake();
            drawSnake();
            drawFood();
            drawObstacles();
            drawScore();
            setTimeout(gameLoop, speed);
        }

        function drawGameOver() {
            ctx.fillStyle = '#ffffff';
            ctx.font = '30px Arial';
            ctx.fillText('Game Over!', canvas.width / 4, canvas.height / 2 - 20);
            ctx.font = '20px Arial';
            ctx.fillText('Press R to Restart', canvas.width / 4, canvas.height / 2 + 20);
        }

        document.addEventListener('keydown', (event) => {
            const newDirection = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right',
                'w': 'up',
                's': 'down',
                'a': 'left',
                'd': 'right'
            }[event.key];

            if (newDirection && !gameOver) {
                if (
                    !(newDirection === 'up' && direction === 'down') &&
                    !(newDirection === 'down' && direction === 'up') &&
                    !(newDirection === 'left' && direction === 'right') &&
                    !(newDirection === 'right' && direction === 'left')
                ) {
                    direction = newDirection;
                }
            } else if (event.key === 'r' || event.key === 'R') {
                initializeGame();
            }
        });


// Theme toggle
const themeButton = document.getElementById('themeButton');
themeButton.addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme', 
        document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
    );
    themeButton.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '🌞' : '🌙';
});

// Colorblind mode toggle
const colorblindButton = document.getElementById('colorblindButton');
colorblindButton.addEventListener('click', () => {
    document.documentElement.setAttribute('data-colorblind', 
        document.documentElement.getAttribute('data-colorblind') === 'true' ? 'false' : 'true'
    );
});

// Instructions modal
const instructionsButton = document.getElementById('instructionsButton');
const instructionsModal = document.getElementById('instructionsModal');
const closeInstructionsButton = document.getElementById('closeInstructionsButton');

instructionsButton.addEventListener('click', () => {
    instructionsModal.style.display = 'flex';
});

closeInstructionsButton.addEventListener('click', () => {
    instructionsModal.style.display = 'none';
});

// Restart button
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', initializeGame);

// Start the game
initializeGame();