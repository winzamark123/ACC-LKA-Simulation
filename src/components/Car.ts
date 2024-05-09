export default class Car {
  x: number;
  y: number;
  width: number;
  height: number;

  speed: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  angle: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 1;
    this.acceleration = 0;
    this.maxSpeed = 10;
    this.friction = 0.5;
    this.angle = 0;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'red';
    context.fillRect(this.x, this.y, this.width, this.height); // draws a rectangle
  }
}
