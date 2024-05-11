import { CarInterface } from '@/types';
import { AIR_DENSITY, DRAG_COEFFICIENT } from '@/lib/physicsConstants';
import { calcDragForce, forceMassToAcceleration } from '@/lib/useEquations';

/*
  Typical Car with the following parameters:
  - x, y: position of the car
  - width, height: dimensions of the car
  - frontal_area: 2.2
  - mass: 1500
  - acceleration_rate: 0.3 (m/s^2)
*/

export default class Car implements CarInterface {
  x: number;
  y: number;
  width: number;
  height: number;

  frontal_area: number;
  mass: number;

  speed: number;
  acceleration: number;

  ACCELERATION_RATE: number = 0.3;
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
    this.maxSpeed = 0;
    this.angle = 0;

    this.mass = 1500;
    this.frontal_area = 2.2;

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

    this.acceleration -= forceMassToAcceleration(this.drag_force, this.mass);
  }

  update() {
    this.updateAcceleration();
    this.speed += this.acceleration;

    if (this.speed < 0.01 && this.acceleration < 0) {
      this.speed = 0;
      this.acceleration = 0;
    }

    this.y -= Math.cos(this.angle) * this.speed;
    this.x += Math.sin(this.angle) * this.speed;
  }

  /*
  ////////////////////////
    CAR Actions that are Controlled by useCarControls
  ////////////////////////
  */

  turnLeft() {
    this.angle -= this.TURNING_RATE;
  }
  turnRight() {
    this.angle += this.TURNING_RATE;
  }
  accelerate() {
    this.acceleration += this.ACCELERATION_RATE;
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
