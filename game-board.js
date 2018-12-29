class GameBoard {
  constructor(selector) {
    this.canvas = document.getElementById(selector);
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext('2d');
    // this.grid = new Grid(this.ctx);

    

    this.snake = new Snake(20, 20, 'beige');
    this.gameHasEnded = false;
  }

  checkForWalls() {    
    return this.snake.x > 0
      && this.snake.x + this.snake.width < this.canvas.width
      && this.snake.y > 0
      && this.snake.y + this.snake.height < this.canvas.height;
  }

  drawSnake() {
    const { x, y, width, height, color } = this.snake;
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.rect(x, y, width, height);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  updateSnakeDirection() {
    this.snake.x += this.snake.dx;
    this.snake.y += this.snake.dy;
  }

  gameOver() {
    this.snake.stop();
    this.drawSnake();
    this.gameHasEnded = true;
  }

  run() {
    if (!this.gameHasEnded) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // this.grid.drawCells();
      this.updateSnakeDirection();
      this.drawSnake();
    }
  }
}