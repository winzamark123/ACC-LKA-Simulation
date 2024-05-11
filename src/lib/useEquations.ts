import { DragForceParams } from '@/types';

export function calcDragForce({
  speed,
  drag_coefficient,
  area,
  air_density,
}: DragForceParams) {
  return 0.5 * drag_coefficient * area * air_density * speed * speed;
}

export function forceMassToAcceleration(force: number, mass: number) {
  return force / mass;
}
