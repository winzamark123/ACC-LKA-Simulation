import { useRef, useEffect } from 'react';
import Car from './Car';

interface IndexCanvasProps {
  width: number;
  height: number;
}

// RequestAnimationFrame?

export default function IndexCanvas({ width, height }: IndexCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mainCar = new Car(50, 50, 100, 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const context = canvas.getContext('2d');

    if (context === null) {
      return;
    }

    // Draw a simple rectangle
    context.fillStyle = '#0000FF'; // blue color
    context.fillRect(10, 10, 150, 100); // draws a rectangle
    mainCar.draw(context);
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
