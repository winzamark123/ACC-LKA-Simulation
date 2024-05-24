import { getIntersection, linear_extrapolation } from '@/lib/useEquations';
import { Line, Point, RaySensorInterface, CarInterface } from '@/types';
import Car from '@/components/Car/Car';

export default class RaySensor implements RaySensorInterface {
  car: CarInterface;
  rayCount: number;
  rayLength: number;
  rayAngleSpread: number;

  rays: Array<[Point, Point]>;
  readings: Array<number>;

  constructor(car: CarInterface) {
    this.car = car;
    this.rayCount = 10;
    this.rayLength = 200;
    this.rayAngleSpread = Math.PI / 3;

    this.rays = [];
    this.readings = [];
  }

  castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      // Calc angle of ray for each Ray
      const angle =
        linear_extrapolation(
          this.rayAngleSpread / 2,
          -this.rayAngleSpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) +
        this.car.angle -
        Math.PI / 2;
      const start = {
        x: this.car.x + this.car.width / 2,
        y: this.car.y + this.car.height / 2,
      };
      const end = {
        x: start.x + this.rayLength * Math.cos(angle),
        y: start.y + this.rayLength * Math.sin(angle),
      };

      // Store the rays
      this.rays.push([start, end]);
    }
  }

  getReadings(ray: Line, traffic: Car[], borders: Line[]) {
    const readings = [];
    for (const border of borders) {
      const intersection = getIntersection(ray, border);
      if (intersection) {
        readings.push(
          Math.sqrt(
            (intersection.x - ray.start.x) ** 2 +
              (intersection.y - ray.start.y) ** 2
          )
        );
      }
    }
    return readings;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.strokeStyle = 'red';
    context.lineWidth = 2;

    for (const [start, end] of this.rays) {
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }

    context.restore();
  }
}
