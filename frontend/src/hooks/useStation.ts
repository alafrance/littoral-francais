import { useEffect, useState } from 'react';
import { getStations, getStation } from '../api/stationApi';

export function useStations() {
  const [stations, setStations] = useState(null as Station[] | null);

  useEffect(() => {
    getStations()
    .then((res) => setStations(res))
  }, []);

  return stations;
}

export function useStation(id: string) {
  const [station, setStation] = useState(null as StationData[] | null);

  useEffect(() => {
    if (!id) {
      setStation(null);
      return;
    }

    getStation(id)
    .then((res) => setStation(res))

  }, [id]);

  return station;
}