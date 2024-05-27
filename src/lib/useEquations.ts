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
  if (!line_a || !line_b) return;
  const a = line_a.start,
    b = line_a.end,
    c = line_b.start,
    d = line_b.end;

  const t_top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
  const u_top = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

  if (bottom != 0) {
    const t = t_top / bottom;
    const u = u_top / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: linear_extrapolation(a.x, b.x, t),
        y: linear_extrapolation(a.y, b.y, t),
        offset: t,
      };
    }
  }
}
