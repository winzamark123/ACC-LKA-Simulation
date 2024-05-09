import Car from '@/components/Car';
import { useEffect } from 'react';

export default function useCarControls(car: Car) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          car.accelerate();
          break;
        case 'ArrowDown':
          car.brake();
          break;
        case 'ArrowLeft':
          car.turnLeft();
          break;
        case 'ArrowRight':
          car.turnRight();
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          car.stopAcceleration();
          break;

        case 'ArrowLeft':
        case 'ArrowRight':
          car.stopTurning();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [car]);
}
