import { DragForceParams, Line } from '@/types';

export function calcDragAcceleration({
  speed,
  drag_coefficient,
  area,
  air_density,
  mass,
}: DragForceParams): number {
  return (0.5 * drag_coefficient * area * air_density * speed * speed) / mass;
}

export function linear_extrapolation(
  start: number,
  end: number,
  t: number
): number {
  return (1 - t) * start + t * end;
}

export function getIntersection(line_a: Line, line_b: Line) {
  const A = line_a.start,
    B = line_a.end,
    C = line_b.start,
    D = line_b.end;
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
