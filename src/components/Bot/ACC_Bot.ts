export default class ACC_Bot {
  forward: boolean;
  stop: boolean;
  left: boolean;
  right: boolean;

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
}
