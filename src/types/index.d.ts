export interface IPID {
  kp: number;
  ki: number;
  kd: number;
  previous_error: number;
  integral: number;
}
export interface ICarStats {
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
