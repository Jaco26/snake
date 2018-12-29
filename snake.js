class Snake {
  constructor(width, height, color) {
    this.v = 3;
    this.x = 300;
    this.y = 300;
    this.dx = this.v;
    this.dy = 0;
    this.width = width;
    this.height = height;
    this.color = color;
    this.body = [];

    document.addEventListener('keydown', (e) => {
      const k = e.keyCode;
      console.log(k);
      
      const v = this.v;
      if (k === 37 && this.dx !== v) {
        this.dx = -v;
        this.dy = 0;
      } else if (k === 38 && this.dy !== v) {
        this.dy = -v;
        this.dx = 0;
      } else if (k === 39 && this.dx !== -v) {
        this.dx = v;
        this.dy = 0;
      } else if (k === 40 && this.dy !== -v) {
        this.dy = v;
        this.dx = 0
      }
    });
  }

  stop() {
    this.color = 'red';
    this.dx = 0;
    this.dy = 0;
  }

}