interface Station {
  lon: number;
  lat: number;
  nom: string;
  id: string;
}
interface StationData extends Station {
  date: string;
  alt: number;
  TN: number | "None";
  TX: number | "None";
  TM: number | "None";
  RR: number | "None";
}
