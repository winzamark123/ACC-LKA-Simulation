import { ICarStats, Line } from '@/types';
import CarControls from '@/components/Car/CarControls';
import { calcDragAcceleration } from '@/lib/useEquations';
import {
  ROAD_FRICTION,
  GRAVITY,
  AIR_DENSITY,
  DRAG_COEFFICIENT,
} from '@/lib/physicsConstants';

import ACC_Bot from '../Bot/ACC_Bot';

/*
  Typical Car with the following parameters:
  - x, y: position of the car
  - width, height: dimensions of the car
  - frontal_area: 2.2
  - mass: 1500
  - acceleration_rate: 0.3 (m/s^2)
*/

interface CarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  isTraffic?: boolean;
  isBot?: boolean;
}

export default class Car {
  // Car Size
  x: number;
  y: number;
  width: number;
  height: number;

  cleanup?: () => void;

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
  controls: CarControls | ACC_Bot;

  isTraffic: boolean;
  isBot: boolean;

  traffic_constant_speed: number;

  borders: Line[];

  constructor({ x, y, width, height, isTraffic, isBot }: CarProps = {}) {
    this.isTraffic = isTraffic || false;
    this.isBot = isBot || false;

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

    this.controls = this.setupControls();
    this.borders = this.getBorders();
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

  private setupControls(): CarControls | ACC_Bot {
    // If the car is a bot, use the ACC_Bot controls
    if (this.isTraffic) {
      return new ACC_Bot();
    }

    if (this.isBot) {
      return new ACC_Bot();
    } else {
      // If the car is not a bot, use the CarControls
      const controls = new CarControls();
      this.bindKeyboardEvents(controls);
      return controls;
    }
  }

  private bindKeyboardEvents(controls: CarControls) {
    // This method will bind the keyboard events to the provided controls
    // Ensure this runs only on client-side where 'window' is defined
    if (typeof window !== 'undefined') {
      const handle_key_down_bound = (event: KeyboardEvent) =>
        controls.handleKeyDown(event);
      const handle_key_up_bound = (event: KeyboardEvent) =>
        controls.handleKeyUp(event);

      window.addEventListener('keydown', handle_key_down_bound);
      window.addEventListener('keyup', handle_key_up_bound);

      // Optionally, to properly clean up, you should keep a reference to these functions
      // so they can be removed later when the component unmounts or controls change
      this.cleanup = () => {
        window.removeEventListener('keydown', handle_key_down_bound);
        window.removeEventListener('keyup', handle_key_up_bound);
      };
    }
  }

  getBorders(): Line[] {
    return [
      //FRONT SIDE
      {
        start: { x: this.x, y: this.y },
        end: { x: this.x + this.width, y: this.y },
      },
      // RIGHT SIDE
      {
        start: { x: this.x + this.width, y: this.y },
        end: { x: this.x + this.width, y: this.y + this.height },
      },
      // BACK SIDE
      {
        start: { x: this.x + this.width, y: this.y + this.height },
        end: { x: this.x, y: this.y + this.height },
      },
      // LEFT SIDE
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
    this.borders = this.getBorders();
  }

  getStats(): ICarStats {
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
    if (this.controls.stop) {
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
