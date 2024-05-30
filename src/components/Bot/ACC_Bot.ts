import { IPID } from '@/types';
export default class ACC_Bot {
  forward: boolean;
  stop: boolean;
  left: boolean;
  right: boolean;
  PID: IPID = {
    kp: 0.1,
    ki: 0.01,
    kd: 0.01,
    previous_error: 0,
    integral: 0,
  };

  constructor() {
    this.forward = false;
    this.stop = false;
    this.left = false;
    this.right = false;
  }

  update(readings: number[]) {
    const average = readings.reduce((a, b) => a + b) / readings.length;

    if (average <= 0.7) {
      this.forward = false;
      this.stop = true;
    } else {
      this.forward = true;
      this.stop = false;
    }
  }

  PIDController(set_point: number, actual_value: number): number {
    const error = set_point - actual_value;

    // Proportional Term
    const P = this.PID.kp * error;

    // Integral Term
    const I = this.PID.ki * this.PID.integral;

    // Derivative Term
    const derivative = error - this.PID.previous_error;
    const D = this.PID.kd * derivative;

    this.PID.previous_error = error;

    const output = P + I + D;
    return output;
  }
}
