import { CarInterface } from '@/types';
import { AIR_DENSITY, DRAG_COEFFICIENT } from '@/lib/physicsConstants';
import { calcDragForce } from '@/lib/useEquations';

export default class Car implements CarInterface {
  x: number;
  y: number;
  width: number;
  height: number;

  frontal_area: number;
  mass: number;

  speed: number;
  acceleration: number;

  ACCELERATION_RATE: number = 0.1;
  TURNING_RATE: number = 0.1;
  BRAKING_RATE: number = 0.5;

  drag_force: number;

  maxSpeed: number;
  angle: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0;
    this.maxSpeed = 10;
    this.angle = 0;

    this.mass = 1000;
    this.frontal_area = 2;

    this.drag_force = 0;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save(); // Save the current state
    context.translate(this.x + this.width / 2, this.y + this.height / 2); // Move to the center of the car
    context.rotate(this.angle); // Rotate the canvas by the car's angle
    context.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    ); // Draw the car centered at the origin
    context.restore(); // Restore the state
  }

  updateAcceleration() {
    this.drag_force = calcDragForce({
      speed: this.speed,
      drag_coefficient: DRAG_COEFFICIENT,
      area: this.frontal_area,
      air_density: AIR_DENSITY,
    });
    this.acceleration -= this.drag_force / this.mass;
  }

  update() {
    this.updateAcceleration();
    this.speed += this.acceleration;

    if (this.speed < 0) {
      this.speed = 0;
      this.acceleration = 0;
    }

    this.y -= Math.cos(this.angle) * this.speed;
    this.x += Math.sin(this.angle) * this.speed;

    console.log(this.speed, this.acceleration, this.angle);
  }

  /*
  ////////////////////////
    CAR Actions that are Controlled by useCarControls
  ////////////////////////
  */

  turnLeft() {
    // this.angle -= this.TURNING_RATE * (this.speed / this.maxSpeed); // Scale turn rate by speed ratio
    this.angle -= this.TURNING_RATE;
  }
  turnRight() {
    this.angle += this.TURNING_RATE * (this.speed / this.maxSpeed); // Scale turn rate by speed ratio
  }
  accelerate() {
    this.acceleration += this.ACCELERATION_RATE;
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
  }
  brake() {
    this.acceleration -= this.BRAKING_RATE;

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
