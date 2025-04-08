// src/components/SafeMapView.tsx
import { useEffect, useState } from "react";
const SafeMapView = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading Map...</div>;
  }

  const MapView = require("./MapView.tsx").default;
  return <MapView />;
};

export default SafeMapView;