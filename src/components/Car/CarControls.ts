import { CarControlsInterface } from '@/types';

export default class CarControls implements CarControlsInterface {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;

  constructor() {
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;
  }

  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.forward = true;
        break;
      case 'ArrowDown':
        this.backward = true;
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
        this.backward = false;
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
