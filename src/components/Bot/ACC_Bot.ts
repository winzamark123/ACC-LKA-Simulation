export default class ACC_Bot {
  forward: boolean;
  stop: boolean;
  left: boolean;
  right: boolean;
  can_turn_right: boolean;
  can_turn_left: boolean;

  constructor() {
    this.forward = false;
    this.stop = false;
    this.left = false;
    this.right = false;
    this.can_turn_right = false;
    this.can_turn_left = false;
  }

  update(
    readings: number[],
    rightsidereadings: number[],
    leftsidereadings: number[]
  ) {
    const average = readings.reduce((a, b) => a + b) / readings.length;
    const avg_center = (readings[1] + readings[2] + readings[3]) / 3;
    if (average <= 0.7 || avg_center < 0.95) {
      this.forward = false;
      this.stop = true;
    } else {
      this.forward = true;
      this.stop = false;
    }

    const rightsideaverage =
      rightsidereadings.reduce((a, b) => a + b) / rightsidereadings.length;
    if (rightsideaverage <= 0.99) {
      this.can_turn_right = false;
    } else {
      this.can_turn_right = true;
    }

    const leftsideaverage =
      leftsidereadings.reduce((a, b) => a + b) / leftsidereadings.length;
    if (leftsideaverage <= 0.99) {
      this.can_turn_left = false;
    } else {
      this.can_turn_left = true;
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
