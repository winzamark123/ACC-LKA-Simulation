import {
  CarInterface,
  CarControlsInterface,
  CarStatsInterface,
  Line,
} from '@/types';
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

interface CarOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  isTraffic?: boolean;
}

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

  isTraffic: boolean;
  traffic_constant_speed: number;

  constructor({ x, y, width, height, isTraffic }: CarOptions = {}) {
    this.isTraffic = isTraffic || false;
    this.x = x || 0;
    this.y = y || this.randomPosition();
    this.width = width || 100;
    this.height = height || this.randomSize();

    this.maxSpeed = 3;
    this.mass = 1500;
    this.frontal_area = 5;

    this.speed = 0;
    this.acceleration = 0;
    this.angle = 0;

    this.drag_acceleration = 0;
    this.traffic_constant_speed = this.randomSpeed();

    this.controls = new CarControls();
  }

  private randomPosition(): number {
    const min_y = 400;
    const max_y = -10000;

    return Math.random() * (max_y - min_y) - min_y;
  }

  private randomSize() {
    const min_height = 100;
    return Math.max(min_height, 50 + Math.random() * 150);
  }

  private randomSpeed() {
    const min_speed = 0.5;
    return Math.max(min_speed, 0.5 + Math.random() * this.maxSpeed - 0.5);
  }

  setupControls() {
    if (typeof window !== 'undefined') {
      const handle_key_down_bound = this.controls.handleKeyDown.bind(
        this.controls
      );
      const handle_key_up_bound = this.controls.handleKeyUp.bind(this.controls);

      window.addEventListener('keydown', handle_key_down_bound);
      window.addEventListener('keyup', handle_key_up_bound);

      return () => {
        window.removeEventListener('keydown', handle_key_down_bound);
        window.removeEventListener('keyup', handle_key_up_bound);
      };
    }
  }

  getBorders(): Line[] {
    return [
      {
        start: { x: this.x, y: this.y },
        end: { x: this.x + this.width, y: this.y },
      },
      {
        start: { x: this.x + this.width, y: this.y },
        end: { x: this.x + this.width, y: this.y + this.height },
      },
      {
        start: { x: this.x + this.width, y: this.y + this.height },
        end: { x: this.x, y: this.y + this.height },
      },
      {
        start: { x: this.x, y: this.y + this.height },
        end: { x: this.x, y: this.y },
      },
    ];
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
  }

  getStats(): CarStatsInterface {
    return {
      speed: this.speed,
      acceleration: this.acceleration,
      angle: this.angle,
      x: this.x,
      y: this.y,
    };
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

    if (this.isTraffic) {
      this.speed = this.traffic_constant_speed;
    }

    // Update Position of the Car
    this.x += Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
}
