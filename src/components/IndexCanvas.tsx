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
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const road = new Road(300, 500);
  const main_car = new Car({
    x: road.getLaneCenter(1),
    y: height - 100,
    width: 50,
    height: 100,
  });
  const rays = new RaySensor(main_car);

  const road_ref = useRef(road);
  const main_car_ref = useRef(main_car);
  const rays_ref = useRef(rays);
  const car_controls = useRef(new CarControls());

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
  main_car.setupControls();

  useEffect(() => {
    const handle_key_down = (event: KeyboardEvent) =>
      car_controls.current.handleKeyDown(event);
    const handle_key_up = (event: KeyboardEvent) =>
      car_controls.current.handleKeyUp(event);

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handle_key_down);
      window.addEventListener('keyup', handle_key_up);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handle_key_down);
        window.removeEventListener('keyup', handle_key_up);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvas_ref.current;

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

      context.translate(0, height - 200 - main_car_ref.current.y);
      road_ref.current.draw(context);
      main_car_ref.current.update(); // Update car state

      for (const car of traffic) {
        car.update();
        car.draw(context);
      }

      rays_ref.current.updateRays(road_ref.current.borders, []); // Update the rays
      main_car_ref.current.draw(context);
      rays_ref.current.draw(context);

      context.restore();

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <main className="flex border border-black">
      <canvas
        ref={canvas_ref}
        className="border border-blue-400"
        width={width}
        height={height}
      ></canvas>
      <div className="border border-red-300">
        <DisplayStats carRef={main_car_ref} />
      </div>
    </main>
  );
}
