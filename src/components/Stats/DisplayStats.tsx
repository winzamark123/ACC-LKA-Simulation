import Car from '@/components/Car/Car';
import { useEffect, useState } from 'react';
import { CarStatsInterface } from '@/types';

interface DisplayStatsProps {
  carRef: React.MutableRefObject<Car>;
}

export default function DisplayStats({ carRef }: DisplayStatsProps) {
  const [carStats, setCarStats] = useState<CarStatsInterface | null>(null);

  useEffect(() => {
    const car = carRef.current;
    if (car) {
      const intervalId = setInterval(() => {
        const stats = car.getStats();
        setCarStats(stats);
      }, 300);

      return () => clearInterval(intervalId);
    }
  }, [carRef]);
  return (
    <main className="flex border border-black">
      <div>
        <h1>STATS</h1>
        <div>
          <h2>Car Stats</h2>
          <ul>
            <li>Speed: {carStats?.speed}</li>
            <li>Acceleration: {carStats?.acceleration}</li>
            <li>Angle: {carStats?.angle}</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
