const CANVAS = document.getElementById('game-canvas');
const W = CANVAS.width = 1000;
const H = CANVAS.height = 600;
const C = CANVAS.getContext('2d');

let RATE = 8;
let RATE_COUNT = RATE;
let GAME_STARTED = false;
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
    this.lightUpCell(snake.row, snake.col, snake.color);
    for (let i = 0; i < snake.tail.length; i++) {
      const { row, col } = snake.tail[i];
      this.lightUpCell(row, col, snake.color);
    }
  }

}


class Snake {
  constructor() {
    this.row = 15;
    this.col = 15;

    this.tail = [];
    this.total = 0;
    this.color = true ? 'lime' : 'pink';

    this.dx = 1;
    this.dy = 0;

    document.addEventListener('keydown', (e) => {
      this.setDirection(e.keyCode);
    });
  }

  setDirection(keyCode) {
    const setDir = (dxVal, dyVal) => {
      if (this.dx !== -dxVal) this.dx = dxVal;
      if (this.dy !== -dyVal) this.dy = dyVal;
    };
    const router = {
      37: () => setDir(-1, 0),
      38: () => setDir(0, -1),
      39: () => setDir(1, 0),
      40: () => setDir(0, 1),
      // 32: () => this.total++,
    };
    if (router[keyCode]) router[keyCode]();
  }

  update() {    
    if (this.total === this.tail.length) {
      // if the this.total is the same as the existing tail length
      for (let i = 0; i < this.tail.length - 1; i++) {
        // shift each item in the tail
        this.tail[i] = this.tail[i + 1];
      }
    }
    // add a new snake sagement to the tail
    this.tail[this.total - 1] = { col: this.col, row: this.row };
    
    this.col += this.dx;
    this.row += this.dy;
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
      this.snake.total++;
      this.generateFood();
    }
    this.snake.update();
  }

  snakeAteFood() {
    return this.snake.row === this.food.row && this.snake.col === this.food.col;
  }

  generateFood() {
    const { nCols, nRows } = this.grid;
    this.food = {
      col: randRange(0, nCols),
      row: randRange(0, nRows),
    };
  }

  over() {
    const { row, col } = this.snake.tail[this.snake.tail.length - 1];
    this.grid.lightUpCell(row, col, 'red')
  }

  snakeInBounds() {
    const { row, col } = this.snake;
    return row >= 0
      && row < this.grid.nRows
      && col >= 0
      && col < this.grid.nCols;
  }

  showClock() {
    const milliSinceStart = Date.now() - START_TIME;
    const seconds = Math.floor(milliSinceStart / 1000);
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
    C.strokeText(this.snake.total, W - 50, 30);
    C.closePath();
  }

}


const game = new Game();

function main() {
  RATE_COUNT -= 1;
  if (game.snakeInBounds() && !game.gameOver) {
    if (RATE_COUNT === 0) {
      game.run();
      RATE_COUNT = RATE;
    }
    requestAnimationFrame(main);
  } else {
    game.over();
  }
}

game.grid.drawSnake(game.snake);

document.addEventListener('keydown', () => {
  if (!GAME_STARTED) {
    GAME_STARTED = true;
    START_TIME = Date.now();
    main();
  }
});
