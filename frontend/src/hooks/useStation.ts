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

export function useStation(id: string, enable: boolean) {
  const [station, setStation] = useState(null as StationData[] | null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !enable) return;
    setLoading(true);

    getStation(id)
    .then((res) => setStation(res))

    setLoading(false);
  }, [id, enable]);

  return {station, loading};
}