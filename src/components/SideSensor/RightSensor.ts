import { getIntersection, linear_extrapolation } from '@/lib/useEquations';
import { Line, RaySensorInterface } from '@/types';
import Car from '@/components/Car/Car';

export default class RightSensor implements RaySensorInterface {
  car: Car;
  rayCount: number;
  rayLength: number;
  rayAngleSpread: number;

  rays: Line[];
  readings: number[];

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 8;
    this.rayLength = 150;
    this.rayAngleSpread = Math.PI / 5;

    this.rays = [];
    this.readings = new Array(this.rayCount).fill(1);
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
        ) + this.car.angle;
      const start = {
        x: this.car.x + this.car.width / 2,
        y: this.car.y + this.car.height / 2,
      };
      const end = {
        x: start.x + this.rayLength * this.readings[i] * Math.cos(angle),
        y: start.y + this.rayLength * this.readings[i] * Math.sin(angle),
      };

      // Store the rays
      this.rays.push({ start, end });
    }
  }

  updateRays(borders: Line[], traffic: Car[]) {
    this.castRays();
    this.readings.fill(1); // Reset readings to 1
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      const distances = this.getReadings(ray, traffic, borders);

      if (distances.length > 0) {
        const min_distance = Math.min(...distances);
        this.readings[i] = min_distance / this.rayLength; // Calculate percentage distance
      }
    }
  }

  getReadings(ray: Line, traffic: Car[], borders: Line[]) {
    const readings = [];

    //removed border as not needed.
    for (const car of traffic) {
      const front_intersection = getIntersection(ray, car.borders[0]);
      const right_intersection = getIntersection(ray, car.borders[1]);
      const right_side_intersection = getIntersection(ray, car.borders[2]);
      const left_intersection = getIntersection(ray, car.borders[3]);
      const left_side_intersection = getIntersection(ray, car.borders[4]);

      const intersections = [
        front_intersection,
        right_intersection,
        right_side_intersection,
        left_intersection,
        left_side_intersection,
      ];

      for (const intersection of intersections) {
        if (intersection) {
          const distance = Math.sqrt(
            (intersection.x - ray.start.x) ** 2 +
              (intersection.y - ray.start.y) ** 2
          );
          readings.push(distance);
        }
      }
    }
    return readings;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.lineWidth = 2;

    for (const ray in this.rays) {
      context.beginPath();
      context.moveTo(this.rays[ray].start.x, this.rays[ray].start.y);
      context.lineTo(this.rays[ray].end.x, this.rays[ray].end.y);
      // x: start.x + this.rayLength * Math.cos(angle),
      // y: start.y + this.rayLength * Math.sin(angle),
      context.strokeStyle = 'yellow';
      context.stroke();
    }

    context.restore();
  }
}
