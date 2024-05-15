import { DragForceParams } from '@/types';

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
