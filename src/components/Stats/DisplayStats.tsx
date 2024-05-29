import Car from '@/components/Car/Car';
import { useEffect, useState } from 'react';
import { ICarStats } from '@/types';

interface DisplayStatsProps {
  carRef: React.MutableRefObject<Car>;
}

export default function DisplayStats({ carRef }: DisplayStatsProps) {
  const [car_stats, set_car_stats] = useState<ICarStats | null>(null);

  useEffect(() => {
    const car = carRef.current;
    if (car) {
      const interval_id = setInterval(() => {
        const stats = car.getStats();
        set_car_stats(stats);
      }, 300);

      return () => clearInterval(interval_id);
    }
  }, [carRef]);
  return (
    <main className="flex border border-black">
      <div>
        <h1>STATS</h1>
        <div>
          <h2>Car Stats</h2>
          <ul>
            <li>Speed: {car_stats?.speed}</li>
            <li>Acceleration: {car_stats?.acceleration}</li>
            <li>Angle: {car_stats?.angle}</li>
            <li>x: {car_stats?.x}</li>
            <li>y: {car_stats?.y}</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
