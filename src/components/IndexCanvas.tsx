import { useRef, useEffect } from 'react';
import Car from './Car/Car';
import Road from './Road/Road';

interface IndexCanvasProps {
  width: number;
  height: number;
}

export default function IndexCanvas({ width, height }: IndexCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mainCar = new Car(500, 500, 100, 100);
  const carRef = useRef(mainCar);

  const road = new Road(500, 1000);
  const roadRef = useRef(road);

  mainCar.setupControls();

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
      roadRef.current.draw(context);
      carRef.current.update(); // Update car state
      carRef.current.draw(context);
      requestAnimationFrame(draw); // Continuously redraw the canvas
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
