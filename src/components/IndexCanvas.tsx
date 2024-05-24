import { useRef, useEffect } from 'react';
import Car from './Car/Car';
import Road from './Road/Road';
import CarControls from './Car/CarControls';
import RaySensor from './RaySensor/RaySensor';
import DisplayStats from './Stats/DisplayStats';

interface IndexCanvasProps {
  width: number;
  height: number;
}

export default function IndexCanvas({ width, height }: IndexCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const road = new Road(300, 500);
  const mainCar = new Car({
    x: road.getLaneCenter(1),
    y: height - 100,
    width: 50,
    height: 100,
  });
  const rays = new RaySensor(mainCar);

  const roadRef = useRef(road);
  const carRef = useRef(mainCar);
  const raysRef = useRef(rays);
  const carControls = useRef(new CarControls());

  const traffic = [
    new Car({ x: road.getRandomLaneCenter(), isTraffic: true }),
    new Car({ x: road.getRandomLaneCenter(), isTraffic: true }),
    new Car({ x: road.getRandomLaneCenter(), isTraffic: true }),
    new Car({ x: road.getRandomLaneCenter(), isTraffic: true }),
    new Car({ x: road.getRandomLaneCenter(), isTraffic: true }),
    new Car({ x: road.getRandomLaneCenter(), isTraffic: true }),
    new Car({ x: road.getRandomLaneCenter(), isTraffic: true }),
    new Car({ x: road.getRandomLaneCenter(), isTraffic: true }),
    new Car({ x: road.getRandomLaneCenter(), isTraffic: true }),
  ];

  // main car has controls
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

      context.translate(0, height - 200 - carRef.current.y);
      roadRef.current.draw(context);
      carRef.current.update(); // Update car state
      raysRef.current.updateRays(roadRef.current.borders, []); // Update the rays
      carRef.current.draw(context);
      raysRef.current.draw(context);

      for (const car of traffic) {
        car.update();
        car.draw(context);
      }
      context.restore();

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <main className="flex border border-black">
      <canvas
        ref={canvasRef}
        className="border border-blue-400"
        width={width}
        height={height}
      ></canvas>
      <div className="border border-red-300">
        <DisplayStats carRef={carRef} />
      </div>
    </main>
  );
}
