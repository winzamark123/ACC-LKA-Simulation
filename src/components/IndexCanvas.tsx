import { useRef, useEffect } from 'react';
import Car from './Car';
import useCarControls from '@/lib/useCarControl';

interface IndexCanvasProps {
  width: number;
  height: number;
}

// RequestAnimationFrame?

export default function IndexCanvas({ width, height }: IndexCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const carRef = useRef(new Car(50, 50, 100, 100));

  useCarControls(carRef.current);

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
      carRef.current.draw(context);
      carRef.current.update(); // Update car state
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
