interface Station {
  lon: number;
  lat: number;
  nom: string;
  id: string;
}
interface StationData extends Station {
  date: string;
  alt: number;
  TN: number;
  TX: number;
  TM: number;
  RR: number;
}
