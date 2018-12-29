class Cell {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Grid {
  constructor(ctx) {
    const { width, height } = ctx.canvas;
    if (width % 20 !== 0 || height % 20 !== 0) {
      throw new Error(
        `Grid cannot be constructed. Ctx height and
        width must be evenly divisible by 10`
      )
    }
    this.ctx = ctx;
    this.cells = this.generateCells();
  }

  generateCells() {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;
    const numX = canvasWidth * .05;
    const numY = canvasHeight * .05;
    const cellWidth = canvasWidth / numX;
    const cellHeight = canvasHeight / numY;
    const accum = [];
    for (let row = 0; row < numY; row++) {
      const y = cellHeight * row;
      for (let col = 0; col < numX; col++) {
        const x = cellWidth * col;
        accum.push(new Cell(x, y, cellWidth, cellHeight));
      }
    }
    return accum;
  }

  drawCell(cell) {    
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'white';
    this.ctx.rect(cell.x, cell.y, cell.width, cell.height);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  // drawCells() {
  //   for (let i = 0; i < this.cells.length; i++) {
  //     this.drawCell(this.cells[i]);
  //   }    
  // }
}

