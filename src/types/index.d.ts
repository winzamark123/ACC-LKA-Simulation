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

  // controls: CarControlsInterface;
}

export interface CarControlsInterface {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export type DragForceParams = {
  speed: number; //m/s
  drag_coefficient: number;
  area: number; //m^2
  air_density: number; //kg/m^3
};
