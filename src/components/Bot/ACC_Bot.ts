import { I_ACC_Bot } from '@/types';
import Car from '@/components/Car/Car';

enum Direction {
  FORWARD,
  STOP,
  LEFT,
  RIGHT,
}
export default class ACC_Bot implements I_ACC_Bot {
  forward: boolean;
  stop: boolean;
  left: boolean;
  right: boolean;

  constructor() {
    this.forward = false;
    this.stop = false;
    this.left = false;
    this.right = false;
  }

  determineAction(readings: number[], car: Car): Direction {
    for (const reading in readings) {
      const calc_y = Number(reading) * Math.sin(car.angle);
      if (calc_y >= 0.3) {
        return Direction.STOP;
      }
    }
    return Direction.FORWARD;
  }
}
