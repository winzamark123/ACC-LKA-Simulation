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
    context.fillStyle = 'blue';
    context.fillRect(this.x, this.y, this.width, this.height); // draws a rectangle
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
