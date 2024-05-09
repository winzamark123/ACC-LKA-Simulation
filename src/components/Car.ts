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

    this.speed = 0;
    this.acceleration = 0;
    this.maxSpeed = 10;
    this.friction = 0.5;
    this.angle = 0;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'blue';
    context.fillRect(this.x, this.y, this.width, this.height); // draws a rectangle
  }

  update() {
    this.speed += this.acceleration;
    if (this.speed < 0) {
      this.speed = 0;
      this.acceleration = 0;
    }

    this.y -= Math.cos(this.angle) * this.speed;
  }

  /*
  ////////////////////////
    CAR Actions that are Controlled by useCarControls
  ////////////////////////
  */

  turnLeft() {
    this.angle -= 0.1;
  }
  turnRight() {
    this.angle += 0.1;
  }
  accelerate() {
    this.acceleration += 0.1;
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
  }
  brake() {
    this.acceleration -= 0.1;
    this.speed += this.acceleration;
    if (this.speed < 0) {
      this.speed = 0;
      this.acceleration = 0;
    }
  }

  stopAcceleration() {
    this.acceleration = 0;
  }
  stopTurning() {}
}
