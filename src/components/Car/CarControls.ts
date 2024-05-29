export default class CarControls {
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
  update() {}

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
}
