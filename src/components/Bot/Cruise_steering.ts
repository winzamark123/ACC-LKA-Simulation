export default class Cruise_steering {
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
    const avg_center = (readings[1] + readings[2] + readings[3]) / 3;
    if (average <= 0.7 || avg_center < 1) {
      this.forward = false;
      this.stop = true;
    } else {
      this.forward = true;
      this.stop = false;
    }
  }
  handleKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.forward = false;
        break;
      case 'ArrowDown':
        this.stop = false;
        break;
      case 'ArrowLeft':
        this.left = false;
        break;
      case 'ArrowRight':
        this.right = false;
        break;
    }
  }
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.forward = true;
        break;
      case 'ArrowDown':
        this.stop = true;
        break;
      case 'ArrowLeft':
        this.left = true;
        break;
      case 'ArrowRight':
        this.right = true;
        break;
    }
  }
}
