import Car from '@/components/Car/Car';

export default class ACC_Bot {
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

  handleKeyDown(): void {}
  handleKeyUp(): void {}

  determineAction(readings: number[], car: Car) {
    for (const reading in readings) {
      const calc_y = Number(reading) * Math.sin(car.angle);
      if (calc_y >= 0.3) {
        this.forward = false;
        this.stop = true;
      }
    }
    this.forward = true;
    this.stop = false;
  }
}
