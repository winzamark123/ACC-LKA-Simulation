import { linear_extrapolation } from '@/lib/useEquations';
import { Point, RaySensorInterface, CarInterface } from '@/types';

export default class RaySensor implements RaySensorInterface {
  car: CarInterface;
  rayCount: number;
  rayLength: number;
  rayAngleSpread: number;

  rays: Array<[Point, Point]>;
  readings: Array<number>;

  constructor(car: CarInterface) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 100;
    this.rayAngleSpread = Math.PI / 4;

    this.rays = [];
    this.readings = [];
  }

  castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const angle =
        linear_extrapolation(
          this.rayAngleSpread / 2,
          -this.rayAngleSpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: start.x + this.rayLength * Math.cos(angle),
        y: start.y + this.rayLength * Math.sin(angle),
      };

      this.rays.push([start, end]);
    }
  }
}
