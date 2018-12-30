const CANVAS = document.getElementById('game-canvas');
const W = CANVAS.width = 1000;
const H = CANVAS.height = 600;
const C = CANVAS.getContext('2d');

let ANIMATION_RATE = 8;
let RATE_COUNT = ANIMATION_RATE;
let GAME_STARTED = false;
let GAME_PAUSED = false;
let START_TIME;

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

class Grid {
  constructor() {
    this.cells = [];
    this.nCols = W * .05;
    this.nRows = H * .05;
    this.generateCells();
  }

  generateCells() {
    const width = W / this.nCols;
    const height = H / this.nRows;
    for (let row = 0; row < this.nRows; row++) {
      const y = height * row;
      const rowCells = [];
      for (let col = 0; col < this.nCols; col++) {
        const x = width * col;
        rowCells.push({ x, y, width, height });
      }
      this.cells.push(rowCells);
    }
  }

  lightUpCell(row, col, color) {
    const cell = this.cells[row][col];
    if (cell) {
      C.beginPath();
      C.rect(cell.x, cell.y, cell.width, cell.height);
      C.strokeStyle = color || 'white';
      C.fillStyle = '#80a0f033';
      C.stroke();
      C.fill();
      C.closePath();
    }
  }

  drawFood(food) {
    this.lightUpCell(food.row, food.col, 'white')
  }

  drawSnake(snake) {
    for (let i = 0; i < snake.body.length; i++) {
      const { row, col } = snake.body[i];
      this.lightUpCell(row, col, snake.color);
    }
  }

}


class Snake {
  constructor() {
    this.row = 15;
    this.col = 15;
    this.score = 0;
    
    // Set to true when this.dx or this.dy are changed in this.setDirection 
    // and false at the end of this.update. When true, this.setDirection
    // will not be called. This prevents the snake from doubling back on
    // itself in the event of a very quick 'valid' direction change, followed 
    // by another that points it back toward its body before this.update
    // can move it out of its way.
    this.willChangeDirection = false;
    // when set to positive int, this.update will decrement it by one
    // as it adds segments onto this.body
    this.segmentsToPush = 0;
    // initialize snake body to include its starting row and column
    this.body = [
      {
        col: this.col,
        row: this.row,
      }
    ];
    
    this.color = true ? 'lime' : 'pink';

    this.dx = 1; // initalize snake as moving to the right
    this.dy = 0;

    // set keydown listener on initialization
    document.addEventListener('keydown', (e) => {
      this.setDirection(e.keyCode);
    });
  }

  setDirection(keyCode) {
    const setDir = (dxVal, dyVal) => {
      if (this.dx !== -dxVal) this.dx = dxVal;
      if (this.dy !== -dyVal) this.dy = dyVal;
      this.willChangeDirection = true;
    };
    const router = {
      37: () => setDir(-1, 0),
      38: () => setDir(0, -1),
      39: () => setDir(1, 0),
      40: () => setDir(0, 1),
    };
    
    if (!GAME_PAUSED && router[keyCode] && !this.willChangeDirection) router[keyCode]();
  }

  updateBody() {
    if (this.segmentsToPush > 0) {
      this.body[this.body.length] = this.body[this.body.length - 1];
      this.segmentsToPush--;
    } else if (OPTIONS.polluterMode === false) {
      // shift the row and col properties of each item in this.body to equal 
      // the row and col properties of the item ahead of it. This causes the snakes 
      // tail to follow it
      for (let i = 0; i < this.body.length - 1; i++) {
        this.body[i] = this.body[i + 1];
      }
    } 
    this.col += this.dx;
    this.row += this.dy;
    this.body[this.body.length - 1] = { col: this.col, row: this.row };
    this.willChangeDirection = false;
  }

}


class Game {
  constructor() {
    this.grid = new Grid();
    this.snake = new Snake();
    this.food = {};
    this.gameOver = false;

    this.generateFood();
  }

  run() {
    C.clearRect(0, 0, W, H);
    this.showClock();
    this.showScore();
    this.grid.drawSnake(this.snake);
    this.grid.drawFood(this.food);
    if (this.snakeAteFood()) {
      this.snake.score++;
      OPTIONS.polluterMode ? this.snake.segmentsToPush += 5 : this.snake.segmentsToPush += 3;
      this.generateFood();
    }
    this.snake.updateBody();
    this.checkGameOver();
  }

  snakeAteFood() {
    return this.snake.row === this.food.row && this.snake.col === this.food.col;
  }

  generateFood() {
    const { nCols, nRows } = this.grid;
    const col = randRange(0, nCols);
    const row = randRange(0, nRows);
    let i, segment;
    for (i = 0; i < this.snake.body.length; i++) {
      segment = this.snake.body[i];
      if (col === segment.col && row === segment.row) {
        // if the new food is gonna be inside the snake, DO IT AGAIN
        // TODO: make this work right
        console.log('trying again to generate food');
        return this.generateFood();
      }
    }
    this.food = { col, row };
  }

  over() {
    let { row, col } = this.snake.body[this.snake.body.length - 1];
    // Coerce row and col values to be in bounds
    // TODO: refactor to make this unnecessary
    if (row >= this.grid.nRows) row = this.grid.nRows - 1;
    if (row < 0) row = 0;
    if (col >= this.grid.nCols) col = this.grid.nCols - 1;
    if (col < 0) col = 0;
    this.grid.lightUpCell(row, col, 'red');
    this.gameOverScreen();
  }

  checkGameOver() {    
    if (!this.snakeInBounds() || this.snakeEatingSelf()) {
      this.gameOver = true;
    }
  }

  snakeInBounds() {
    const { row, col } = this.snake;
    return row >= 0
      && row < this.grid.nRows
      && col >= 0
      && col < this.grid.nCols;
  }

  snakeEatingSelf() {
    const { row, col } = this.snake;
    const body = this.snake.body;    
    let i;
    for (i = 0; i < body.length - 1; i++) {
      if (col === body[i].col && row === body[i].row) {
        return true;
      }
    }
  }

  gameOverScreen() {
    C.beginPath();
    C.font = '50px Arial';
    C.fillStyle = 'orange';
    C.fillText('Game Over', (W / 2) - 100, H / 2);
    C.closePath();
  }

  startScreen() {
    this.grid.drawSnake(this.snake);
    this.showClock();
    this.showScore();
    C.beginPath();
    C.font = '50px Arial';
    C.fillStyle = 'cyan';
    C.fillText('Press any key...', (W / 2) - 100, H / 2);
    C.closePath();
  }

  showClock() {
    const milliSinceStart = Date.now() - START_TIME;
    const seconds = Math.floor(milliSinceStart / 1000) || 0;
    C.beginPath();
    C.font = '30px Arial';
    C.fillStyle = 'white';
    C.fillText('Time: ', 20, 30);
    C.fillStyle = 'pink';
    C.strokeStyle = 'pink';
    C.strokeText(seconds, 120, 30);
    C.closePath();
  }

  showScore() {
    C.beginPath();
    C.font = '30px Arial';
    C.fillStyle = 'white';
    C.fillText('Score: ', W - 150, 30);
    C.fillStyle = 'pink';
    C.strokeStyle = 'pink';
    C.strokeText(this.snake.score, W - 50, 30);
    C.closePath();
  }
}


const game = new Game();

game.startScreen();

function main() {
  RATE_COUNT -= 1;
  if (!game.gameOver) {
    if (RATE_COUNT === 0) {
      if (!GAME_PAUSED) game.run();
      RATE_COUNT = ANIMATION_RATE;
    }
    requestAnimationFrame(main);
  } else {
    pauseButton.el.disabled = true;
    game.over();
  }
}

document.addEventListener('keydown', () => {
  if (!GAME_STARTED) {
    GAME_STARTED = true;
    START_TIME = Date.now();
    pauseButton.el.disabled = false;
    main();
  }
});

pauseButton.on('click', () => {
  if (GAME_PAUSED) {
    GAME_PAUSED = false;
    pauseButton.el.textContent = 'Pause';
  } else {
    GAME_PAUSED = true;
    pauseButton.el.textContent = 'Resume';
  }
});

