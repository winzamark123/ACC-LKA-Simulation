import { useRef, useEffect } from 'react';
import Car from './Car/Car';
import Road from './Road/Road';
import CarControls from './Car/CarControls';

interface IndexCanvasProps {
  width: number;
  height: number;
}

export default function IndexCanvas({ width, height }: IndexCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const road = new Road(500, 1000);
  const roadRef = useRef(road);
  const mainCar = new Car(road.getLaneCenter(0), 500, 100, 100);
  const carRef = useRef(mainCar);

  mainCar.setupControls();
  const carControls = useRef(new CarControls());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) =>
      carControls.current.handleKeyDown(event);
    const handleKeyUp = (event: KeyboardEvent) =>
      carControls.current.handleKeyUp(event);

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const context = canvas.getContext('2d');

    if (context === null) {
      return;
    }
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();

      context.translate(-carRef.current.x, -carRef.current.y);

      roadRef.current.draw(context);

      // Restore the context state
      context.restore();
      carRef.current.update(); // Update car state

      // Draw the car at the center of the canvas
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      carRef.current.draw(context);
      context.restore();

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <main>
      <canvas
        ref={canvasRef}
        className="border border-blue-400"
        width={width}
        height={height}
      ></canvas>
      <div className="border border-red-300">
        <h1>CANVAS HERE</h1>
      </div>
    </main>
  );
}
