import { RoadInterface, Point } from '@/types';
import { linear_extrapolation } from '@/lib/useEquations';
import { Line } from '@/types';

export default class Road implements RoadInterface {
  x: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  lane_count: number;

  borders: Line[];

  constructor(x: number, width: number, lane_count: number = 3) {
    this.x = x;
    this.width = width;
    this.lane_count = lane_count;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;
    this.left = this.x - width / 2;
    this.right = this.x + width / 2;

    const topLeft: Point = { x: this.left, y: this.top };
    const topRight: Point = { x: this.right, y: this.top };
    const bottomLeft: Point = { x: this.left, y: this.bottom };
    const bottomRight: Point = { x: this.right, y: this.bottom };

    this.borders = [
      { start: topLeft, end: bottomLeft },
      { start: topRight, end: bottomRight },
    ];
  }

  getLaneCenter(laneIndex: number): number {
    const lane_width = this.width / this.lane_count;
    return lane_width / 2 + Math.min(laneIndex, this.lane_count) * lane_width;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';

    // Drawing lane dividers
    for (let i = 1; i <= this.lane_count - 1; i++) {
      const x = linear_extrapolation(
        this.left,
        this.right,
        i / this.lane_count
      );
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    // Drawing borders
    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border.start.x, border.start.y);
      ctx.lineTo(border.end.x, border.end.y);
      ctx.stroke();
    });
  }
}
