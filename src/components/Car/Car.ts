import { CarInterface, CarControlsInterface } from '@/types';
import CarControls from '@/components/Car/CarControls';
import { calcDragAcceleration } from '@/lib/useEquations';
import {
  ROAD_FRICTION,
  GRAVITY,
  AIR_DENSITY,
  DRAG_COEFFICIENT,
} from '@/lib/physicsConstants';

/*
  Typical Car with the following parameters:
  - x, y: position of the car
  - width, height: dimensions of the car
  - frontal_area: 2.2
  - mass: 1500
  - acceleration_rate: 0.3 (m/s^2)
*/

export default class Car implements CarInterface {
  // Car Size
  x: number;
  y: number;
  width: number;
  height: number;

  // Car Attributes
  frontal_area: number;
  mass: number;
  maxSpeed: number;
  ACCELERATION_RATE: number = 0.03;
  TURNING_RATE: number = 0.01;
  BRAKING_RATE: number = 0.05;

  // Car Movement
  speed: number;
  acceleration: number;

  drag_acceleration: number;
  angle: number;

  // Car Controls
  controls: CarControlsInterface;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.maxSpeed = 3;
    this.mass = 1500;
    this.frontal_area = 5;

    this.speed = 0;
    this.acceleration = 0;
    this.angle = 0;

    this.drag_acceleration = 0;

    this.controls = new CarControls();
  }

  setupControls() {
    if (typeof window !== 'undefined') {
      const handleKeyDownBound = this.controls.handleKeyDown.bind(
        this.controls
      );
      const handleKeyUpBound = this.controls.handleKeyUp.bind(this.controls);

      window.addEventListener('keydown', handleKeyDownBound);
      window.addEventListener('keyup', handleKeyUpBound);

      return () => {
        window.removeEventListener('keydown', handleKeyDownBound);
        window.removeEventListener('keyup', handleKeyUpBound);
      };
    }
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

  update() {
    this.move();
    console.log(
      'speed:',
      this.speed,
      'accelerate:',
      this.acceleration,
      'angle:',
      this.angle,
      'x:',
      this.x,
      'y:',
      this.y
    );
  }

  /*
  ////////////////////////
    CAR Actions that are Controlled by useCarControls
  ////////////////////////
  */

  turnLeft() {
    this.angle -= this.TURNING_RATE * (this.speed / this.maxSpeed);
  }
  turnRight() {
    this.angle += this.TURNING_RATE * (this.speed / this.maxSpeed);
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

  move() {
    // Car Controls Forward
    if (this.controls.forward) {
      this.speed += this.ACCELERATION_RATE;
    }

    // Car Controls Backward
    if (this.controls.backward) {
      this.speed -= this.BRAKING_RATE;
    }

    // Car Drag
    if (this.speed > 0) {
      this.drag_acceleration = calcDragAcceleration({
        speed: this.speed,
        drag_coefficient: DRAG_COEFFICIENT,
        area: this.frontal_area,
        air_density: AIR_DENSITY,
        mass: this.mass,
      });

      const friction_acceleration = ROAD_FRICTION * GRAVITY;

      this.speed -= this.drag_acceleration + friction_acceleration;
    }

    // Speed Limits
    if (this.speed < 0) {
      this.speed = 0;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    // Handles turns with Speed
    if (this.speed != 0) {
      if (this.controls.left) {
        this.turnLeft();
      }
      if (this.controls.right) {
        this.turnRight();
      }
    }

    // Update Position of the Car
    this.x += Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
}
