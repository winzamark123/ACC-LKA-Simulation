import { useRef, useEffect } from 'react';
import Car from './Car/Car';
import Road from './Road/Road';
import CarControls from './Car/CarControls';
import RaySensor from './RaySensor/RaySensor';

interface IndexCanvasProps {
  width: number;
  height: number;
}

export default function IndexCanvas({ width, height }: IndexCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const road = new Road(500, 1000);
  const mainCar = new Car(road.getLaneCenter(0), 500, 100, 100);
  const rays = new RaySensor(mainCar);

  const roadRef = useRef(road);
  const carRef = useRef(mainCar);
  const raysRef = useRef(rays);
  const carControls = useRef(new CarControls());

  mainCar.setupControls();

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

      context.translate(0, -carRef.current.y);
      roadRef.current.draw(context);

      // Restore the context state
      context.restore();
      carRef.current.update(); // Update car state
      raysRef.current.castRays(); // Cast rays from the car

      // Draw the car at the center of the canvas
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      carRef.current.draw(context);
      raysRef.current.draw(context);
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
