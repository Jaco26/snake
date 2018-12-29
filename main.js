const CANVAS = document.getElementById('game-canvas');
const W = CANVAS.width = 700;
const H = CANVAS.height = 700;
const C = CANVAS.getContext('2d');

let RATE = 10;
let RATE_COUNT = RATE;


class GridCell {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    
    this.width = width;
    this.height = height;
  }
}

class Grid {
  constructor() {
    this.cells = [];
    this.nCols = W * .05;
    this.nRows = H * .05;
    this.generateCells();
  }

  generateCells() {
    const cellWidth = W / this.nCols;
    const cellHeight = H / this.nRows;
    for (let row = 0; row < this.nRows; row++) {
      const y = cellHeight * row;
      const rowCells = [];
      for (let col = 0; col < this.nCols; col++) {
        const x = cellWidth * col;
        rowCells.push(new GridCell(x, y, cellWidth, cellHeight));
      }
      this.cells.push(rowCells);
    }
  }

  lightUpCell(row, col, color) {
    const cell = this.cells[row][col];
    if (cell) {
      C.beginPath();
      C.strokeStyle = color || 'white';
      C.strokeRect(cell.x, cell.y, cell.width, cell.height);
      C.closePath();
    }
  }

  drawSnake(snake) {
    this.lightUpCell(snake.row, snake.col, snake.color);
    for (let i = 0; i < snake.tail.length; i++) {
      const { row, col } = snake.tail[i];
      this.lightUpCell(row, col, snake.color);
    }
  }

}


class SnakeSegment {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }
}


class Snake {
  constructor() {
    this.row = 15;
    this.col = 15;

    this.tail = [];
    this.total = 0;
    this.color = 'pink'

    this.dx = 1;
    this.dy = 0;

    document.addEventListener('keydown', (e) => {
      this.setDirection(e.keyCode);
    });
  }

  setDirection(keyCode) {
    const setDir = (dxVal, dyVal) => {
      this.dx = dxVal; 
      this.dy = dyVal;
    };
    const router = {
      37: () => this.dx !== -1 ? setDir(-1, 0) : null,
      38: () => this.dy !== -1 ? setDir(0, -1): null,
      39: () => this.dx !== 1 ? setDir(1, 0) : null,
      40: () => this.dy !== 1 ? setDir(0, 1) : null,
      32: () => this.grow(),
    };
    if (router[keyCode]) router[keyCode]();
  }

  grow() {
    this.total++;
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
    this.tail[this.total - 1] = new SnakeSegment(this.row, this.col);
    
    this.col += this.dx;
    this.row += this.dy;
  }
}


class Game {
  constructor() {
    this.grid = new Grid();
    this.snake = new Snake();
  }

  run() {
    console.log(this.snake.tail);
    this.clearBoard();
    this.grid.drawSnake(this.snake);
    this.snake.update();
  }

  snakeInBounds() {
    const { row, col } = this.snake;
    return row >= 0
      && row < this.grid.nRows
      && col >= 0
      && col < this.grid.nCols;
  }

  clearBoard() {
    C.clearRect(0, 0, W, H);
  }

}


const game = new Game();

function main() {
  RATE_COUNT -= 1;
  if (game.snakeInBounds()) {
    if (RATE_COUNT === 0) {
      game.run();
      RATE_COUNT = RATE;
    }
    requestAnimationFrame(main);
  } 
  
}

game.grid.drawSnake(game.snake);
main();