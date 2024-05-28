import Car from '../Car/Car';
import Road from '../Road/Road';

// Create traffic cars
export function createTraffic(road: Road, traffic_count: number) {
  const traffic: Car[] = [];
  for (let i = 0; i < traffic_count; i++) {
    const car = new Car({
      x: road.getRandomLaneCenter(),
      isTraffic: true,
    });
    traffic.push(car);
  }
  return traffic;
}
