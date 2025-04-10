interface PointData {
  lon: number;
  lat: number;
  sizeKm: number;
  opacity: number;
  label?: string;
}

interface MapComponentProps {
  pulseRedPoints?: boolean;
}