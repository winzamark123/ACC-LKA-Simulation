import { useRef, useEffect, useState } from 'react';
import Car from './Car/Car';
import Road from './Road/Road';
import CarControls from './Car/CarControls';
import RaySensor from './RaySensor/RaySensor';
import RightSensor from './SideSensor/RightSensor';
import DisplayStats from './Stats/DisplayStats';
import { createTraffic } from './Traffic/Traffic';
import LeftSensor from './SideSensor/LeftSensor';

interface IndexCanvasProps {
  width: number;
  height: number;
}

// Initialize components (road, car, rays, car_controls)
function initComponents(height: number) {
  const road = new Road(300, 500);
  const main_car = new Car({
    x: road.getLaneCenter(0),
    y: height - 100,
    width: 50,
    height: 100,
    isBot: true,
  });
  const rays = new RaySensor(main_car);
  const rightrays = new RightSensor(main_car);
  const leftrays = new LeftSensor(main_car);
  const car_controls = new CarControls();

  return {
    road,
    main_car,
    rays,
    rightrays,
    leftrays,
    car_controls,
  };
}

// Custom hook for setting up keybindings
function useKeybindings(car_controls_ref: React.MutableRefObject<CarControls>) {
  useEffect(() => {
    const handle_key_down = (event: KeyboardEvent) =>
      car_controls_ref.current.handleKeyDown(event);
    const handle_key_up = (event: KeyboardEvent) =>
      car_controls_ref.current.handleKeyUp(event);

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
  }, [car_controls_ref]);
}

export default function IndexCanvas({ width, height }: IndexCanvasProps) {
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const { road, main_car, rays, rightrays, leftrays, car_controls } =
    initComponents(height);
  const traffic = createTraffic(road, 15);

  const road_ref = useRef(road);
  const main_car_ref = useRef(main_car);
  const rightrays_ref = useRef(rightrays);
  const leftrays_ref = useRef(leftrays);
  const rays_ref = useRef(rays);
  const car_controls_ref = useRef(car_controls);
  const [turns, set_turns] = useState('none');
  useKeybindings(car_controls_ref);

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
      // UPDATING The Canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.translate(0, height - 200 - main_car_ref.current.y);

      // Update the bot
      main_car_ref.current.controls.update(
        rays_ref.current.readings,
        rightrays_ref.current.readings,
        leftrays_ref.current.readings
      );

      // Update the car
      main_car_ref.current.update();

      // Update the traffic
      for (const car of traffic) {
        car.update();
      }

      // Update the rays
      rays_ref.current.updateRays(road_ref.current.borders, traffic);
      rightrays_ref.current.updateRays(road_ref.current.borders, traffic);
      leftrays_ref.current.updateRays(road_ref.current.borders, traffic);

      set_turns('center');
      if (main_car_ref.current.switch_to_left) set_turns('left');
      if (main_car_ref.current.switch_to_right) set_turns('right');

      // DRAWING CODE
      //////////////////////////////////////
      for (const car of traffic) {
        car.draw(context);
      }
      road_ref.current.draw(context);
      main_car_ref.current.draw(context);
      rays_ref.current.draw(context);
      rightrays_ref.current.draw(context);
      leftrays_ref.current.draw(context);

      context.restore();

      requestAnimationFrame(draw);
      //////////////////////////////////////
    };

    draw();
  }, []);

  function SwitchRight() {
    main_car_ref.current.switch_to_right = true;
    console.log('button pressed, switching to right!');
  }
  function SwitchLeft() {
    main_car_ref.current.switch_to_left = true;
    console.log('button pressed, switching to left!');
  }

  function Buttons() {
    if (turns == 'center') {
      return (
        <>
          <button className="border border-black p-10 " onClick={SwitchLeft}>
            Switch to left
          </button>
          <button className="border border-black p-10" onClick={SwitchRight}>
            Switch to right
          </button>
        </>
      );
    } else {
      return <div className="p-10">Switching to {turns}...</div>;
    }
  }
  return (
    <main className="">
      <div className="flex border border-black">
        <canvas
          ref={canvas_ref}
          className="border border-blue-400"
          width={width}
          height={height}
        ></canvas>
        <div className="border border-red-300">
          <DisplayStats carRef={main_car_ref} />
        </div>
      </div>
      <div className="border border-black text-3xl">
        <Buttons />
      </div>
    </main>
  );
}
