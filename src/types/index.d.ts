export interface CarInterface {
  x: number;
  y: number;
  width: number;
  height: number;

  frontal_area: number;
  mass: number;

  speed: number;
  acceleration: number;

  ACCELERATION_RATE: number;
  TURNING_RATE: number;
  BRAKING_RATE: number;

  drag_force: number;

  maxSpeed: number;
  angle: number;
}

export type DragForceParams = {
  speed: number;
  drag_coefficient: number;
  area: number;
  air_density: number;
};
