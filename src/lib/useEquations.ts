import { DragForceParams, Point } from '@/types';

export function calcDragAcceleration({
  speed,
  drag_coefficient,
  area,
  air_density,
  mass,
}: DragForceParams) {
  return (0.5 * drag_coefficient * area * air_density * speed * speed) / mass;
}

export function linear_extrapolation(start: number, end: number, t: number) {
  return (1 - t) * start + t * end;
}

export function getIntersection(A: Point, B: Point, C: Point, D: Point) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: linear_extrapolation(A.x, B.x, t),
        y: linear_extrapolation(A.y, B.y, t),
        offset: t,
      };
    }
  }
}
