export interface CarStatsInterface {
  speed: number;
  acceleration: number;
  angle: number;
  x: number;
  y: number;
}

export interface RoadInterface {
  x: number;

  top: number;
  bottom: number;
  left: number;
  right: number;

  width: number;
  lane_count: number;
}

export type Point = {
  x: number;
  y: number;
};

export type Line = {
  start: Point;
  end: Point;
};

export interface CarInterface {
  x: number;
  y: number;
  width: number;
  height: number;

  frontal_area: number;
  mass: number;
  maxSpeed: number;

  speed: number;
  acceleration: number;

  ACCELERATION_RATE: number;
  TURNING_RATE: number;
  BRAKING_RATE: number;

  drag_acceleration: number;
  angle: number;

  controls: CarControlsInterface;
}

export interface CarControlsInterface {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  handleKeyDown(event: KeyboardEvent): void;
  handleKeyUp(event: KeyboardEvent): void;
}

export interface RaySensorInterface {
  car: Car;
  rayCount: number;
  rayLength: number;
  rayAngleSpread: number;

  rays: list;
  readings: list;
}

export type DragForceParams = {
  speed: number; //m/s
  drag_coefficient: number;
  area: number; //m^2
  air_density: number; //kg/m^3
  mass: number; //kg
};
