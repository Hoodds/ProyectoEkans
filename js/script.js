const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const gridSize = 20
const cellSize = 30

canvas.width = gridSize * cellSize
canvas.height = gridSize * cellSize

let snake, direction, food, score, gameOver, speed, obstacles, isPaused

function spawnFood() {
  let foodPosition
  do {
    foodPosition = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    }
  } while (isPositionOccupied(foodPosition))
  return foodPosition
}

function generateObstacles() {
  const numObstacles = 10
  const obstaclePositions = []
  for (let i = 0; i < numObstacles; i++) {
    let obstacle
    do {
      obstacle = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      }
    } while (isPositionOccupied(obstacle))
    obstaclePositions.push(obstacle)
  }
  return obstaclePositions
}

function isPositionOccupied(position) {
  return (
    snake.some((segment) => segment.x === position.x && segment.y === position.y) ||
    obstacles?.some((obstacle) => obstacle.x === position.x && obstacle.y === position.y)
  )
}

function drawGrid() {
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-background")
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawSnake() {
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-snake")
  snake.forEach((segment) => {
    ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 1, cellSize - 1)
  })
}

function drawFood() {
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-food")
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 1, cellSize - 1)
}

function drawObstacles() {
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-obstacle")
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x * cellSize, obstacle.y * cellSize, cellSize - 1, cellSize - 1)
  })
}

function updateScoreAndLevel() {
  document.getElementById("score").textContent = `Score: ${score}`
  document.getElementById("level").textContent = `Level: ${Math.ceil(score / 20)}`
}

function moveSnake() {
  const head = { ...snake[0] }

  switch (direction) {
    case "up":
      head.y--
      break
    case "down":
      head.y++
      break
    case "left":
      head.x--
      break
    case "right":
      head.x++
      break
  }

  snake.unshift(head)

  if (head.x === food.x && head.y === food.y) {
    food = spawnFood()
    score += 10
    increaseDifficulty()
  } else {
    snake.pop()
  }

  if (
    head.x < 0 ||
    head.x >= gridSize ||
    head.y < 0 ||
    head.y >= gridSize ||
    snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y) ||
    obstacles.some((obstacle) => obstacle.x === head.x && obstacle.y === head.y)
  ) {
    gameOver = true
  }
}

function increaseDifficulty() {
  if (speed > 50) {
    speed -= 5
  }
}

function gameLoop() {
  if (gameOver) {
    drawGameOver()
    return
  }

  if (!isPaused) {
    drawGrid()
    moveSnake()
    drawSnake()
    drawFood()
    drawObstacles()
    updateScoreAndLevel()
  }

  setTimeout(gameLoop, speed)
}

function drawGameOver() {
  const mensajeAlerta = document.getElementById("mensaje_alerta")
  const mensajeTexto = document.getElementById("mensajeTexto")
  const botonVolverJugar = document.getElementById("botonVolverJugar")

  mensajeTexto.textContent = `¡Juego terminado! Puntuación: ${score}`
  mensajeTexto.innerHTML += "<br><br>Presiona el botón o la tecla 'R' para volver a jugar."
  botonVolverJugar.style.display = "block"
  mensajeAlerta.classList.add("mostrar")
}

function initializeGame() {
  snake = [{ x: 10, y: 10 }]
  direction = "right"
  food = spawnFood()
  score = 0
  gameOver = false
  speed = 200
  obstacles = generateObstacles()
  isPaused = false
  updateScoreAndLevel()
  hidePauseMessage()
  updateCanvasColors()
  gameLoop()
}

function togglePause() {
  if (gameOver) return // No permitir pausar si el juego ha terminado

  isPaused = !isPaused
  if (isPaused) {
    showPauseMessage()
  } else {
    hidePauseMessage()
  }
}

function showPauseMessage() {
  const mensajeAlerta = document.getElementById("mensaje_alerta")
  const mensajeTexto = document.getElementById("mensajeTexto")
  mensajeTexto.textContent = "Juego pausado"
  mensajeAlerta.classList.add("mostrar")
  document.getElementById("botonVolverJugar").style.display = "none"
}

function hidePauseMessage() {
  const mensajeAlerta = document.getElementById("mensaje_alerta")
  mensajeAlerta.classList.remove("mostrar")
}

function updateCanvasColors() {
  if (!gameOver && !isPaused) {
    drawGrid()
    drawSnake()
    drawFood()
    drawObstacles()
  }
}

function updateTheme(newTheme) {
  const html = document.documentElement
  html.setAttribute("data-theme", newTheme)
  themeButton.querySelector(".icono-alternar-tema").textContent = newTheme === "light" ? "🌞" : "🌙"
  updateCanvasColors()
}

function configurarModoDaltonico() {
  const botonDaltonico = document.getElementById('botonDaltonico');
  const html = document.documentElement;
  const aviso = document.createElement('div');
  aviso.className = 'aviso-daltonico';
  aviso.textContent = 'Modo daltónico activado';
  document.body.appendChild(aviso);

  const modoDaltonicoGuardado = localStorage.getItem('modoDaltonico') === 'true';
  this.establecerModoDaltonico(modoDaltonicoGuardado, html, botonDaltonico, aviso);

  botonDaltonico.addEventListener('click', () => {
      const nuevoModo = html.getAttribute('data-colorblind') !== 'true';
      this.establecerModoDaltonico(nuevoModo, html, botonDaltonico, aviso);
  });
}

function establecerModoDaltonico(activar, html, boton, aviso) {
  html.setAttribute('data-colorblind', activar);
  localStorage.setItem('modoDaltonico', activar);

  if (activar) {
      boton.classList.add('active');
      aviso.classList.add('show');
      setTimeout(() => aviso.classList.remove('show'), 3000);
  } else {
      boton.classList.remove('active');
      aviso.classList.remove('show');
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const botonJugar = document.getElementById("botonJugar")
  const paginaBienvenida = document.getElementById("paginaBienvenida")
  const contenedorJuego = document.getElementById("contenedorJuego")
  const botonInstrucciones = document.getElementById("botonInstrucciones")
  const instructionsModal = document.getElementById("instructionsModal")
  const mensajeAlerta = document.getElementById("mensaje_alerta")

  botonJugar.addEventListener("click", () => {
    paginaBienvenida.style.display = "none"
    contenedorJuego.style.display = "flex"
    botonInstrucciones.style.display = "flex"
    initializeGame()
  })

  botonInstrucciones.addEventListener("click", () => {
    instructionsModal.style.display = "flex"
  })

  document.querySelector(".cerrar").addEventListener("click", () => {
    instructionsModal.style.display = "none"
  })

  window.addEventListener("click", (e) => {
    if (e.target === instructionsModal) {
      instructionsModal.style.display = "none"
    }
  })

  document.getElementById("botonVolverJugar").addEventListener("click", () => {
    mensajeAlerta.classList.remove("mostrar")
    initializeGame()
  })

  const botonPausa = document.getElementById("botonPausa")
  botonPausa.addEventListener("click", togglePause)

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault() // Previene la acción por defecto del espacio
      togglePause()
      return
    }

    const newDirection = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    }[event.key]

    if (newDirection && !gameOver && !isPaused) {
      if (
        !(newDirection === "up" && direction === "down") &&
        !(newDirection === "down" && direction === "up") &&
        !(newDirection === "left" && direction === "right") &&
        !(newDirection === "right" && direction === "left")
      ) {
        direction = newDirection
      }
    } else if ((event.key === "r" || event.key === "R") && gameOver) {
      initializeGame()
    }
  })

  configurarModoDaltonico()
})

const themeButton = document.getElementById("botonTema")
themeButton.addEventListener("click", () => {
  const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light"
  updateTheme(newTheme)
})

