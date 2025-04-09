import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { Circle as CircleGeometry } from "ol/geom";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
import { Style, Fill } from "ol/style";
import Overlay from "ol/Overlay";
import axios from "axios"; // Appels HTTP vers backend

interface PointData {
  lon: number;
  lat: number;
  sizeKm: number;
  opacity: number;
  label?: string;
}

interface MapComponentProps {
  activeSets: string[];
  year: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ activeSets, year }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const layersRef = useRef<Record<string, VectorLayer>>( {} );
  const [map, setMap] = useState<Map | null>(null);

  const COLORS: Record<string, string> = {
    yellow: "#F1C40F",
    red: "#E74C3C",
    violet: "#9B59B6",
  };

  // Initial data for red and violet (fixed)
  const staticData: Record<string, PointData[]> = {
    red: [
      { lon: 3.0333, lat: 43.1833, sizeKm: 50, opacity: 0.4, label: "Zone rouge : Sète" },
      { lon: -1.9336, lat: 46.7075, sizeKm: 100, opacity: 0.4, label: "Zone rouge : La Rochelle" },
    ],
    violet: [
      { lon: -4.4944, lat: 48.3904, sizeKm: 200, opacity: 0.4 },
    ],
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const baseMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([2.35, 46.5]),
        zoom: 6,
      }),
    });

    setMap(baseMap);

    if (popupRef.current) {
      const overlay = new Overlay({
        element: popupRef.current,
        positioning: "bottom-center",
        stopEvent: false,
        offset: [0, -15],
      });
      baseMap.addOverlay(overlay);
      overlayRef.current = overlay;
    }

    return () => baseMap.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!map) return;

    // ➡️ Nettoyer les anciens layers
    Object.values(layersRef.current).forEach(layer => {
      map.removeLayer(layer);
    });
    layersRef.current = {};

    // ➡️ Créer les layers fixés (rouge et violet)
    activeSets.forEach((setName) => {
      if (setName === "yellow") return; // Gestion des jaunes à part

      const points = staticData[setName];
      if (!points) return;

      const features = points.map(({ lon, lat, sizeKm, opacity, label }) => {
        const center = fromLonLat([lon, lat]);
        const radiusMeters = sizeKm * 1000;
        const circle = new CircleGeometry(center, radiusMeters);
        const feature = new Feature(circle);

        feature.setStyle(
          new Style({
            fill: new Fill({
              color: applyOpacity(COLORS[setName], opacity),
            }),
          })
        );

        if (label) {
          feature.set("label", label);
        }

        return feature;
      });

      const vectorSource = new VectorSource({ features });
      const vectorLayer = new VectorLayer({ source: vectorSource });

      layersRef.current[setName] = vectorLayer;
      map.addLayer(vectorLayer);
    });

    // ➡️ Ajouter un vide pour les jaunes (sera rempli ensuite)
    if (activeSets.includes("yellow")) {
      const yellowLayer = new VectorLayer({
        source: new VectorSource(),
      });
      layersRef.current["yellow"] = yellowLayer;
      map.addLayer(yellowLayer);
    }

    // ➡️ Activer les infobulles
    map.on("pointermove", function (evt) {
      if (!overlayRef.current || !popupRef.current) return;

      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, function (feat) {
        return feat;
      });

      if (feature && feature.get("label")) {
        const coordinate = evt.coordinate;
        popupRef.current.innerHTML = feature.get("label");
        overlayRef.current.setPosition(coordinate);
        popupRef.current.style.display = "block";
      } else {
        popupRef.current.style.display = "none";
      }
    });

  }, [activeSets, map]);

  // ➡️ MAJ des points jaunes uniquement quand year change
  useEffect(() => {
    if (!map) return;
    if (!layersRef.current["yellow"]) return;

    const yellowLayer = layersRef.current["yellow"];
    const yellowSource = yellowLayer.getSource();
    if (!yellowSource) return;

    async function fetchYellowPoints() {
      try {
        const response = await axios.get(`/api/yellow-points?year=${year}`);
        const yellowPoints: PointData[] = response.data;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        yellowSource.clear();

        const newFeatures = yellowPoints.map(({ lon, lat, sizeKm }) => {
          const center = fromLonLat([lon, lat]);
          const circle = new CircleGeometry(center, sizeKm * 1000);
          const feature = new Feature(circle);

          feature.setStyle(
            new Style({
              fill: new Fill({
                color: applyOpacity(COLORS["yellow"], 1.0),
              }),
            })
          );

          return feature;
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        yellowSource.addFeatures(newFeatures);
      } catch (error) {
        console.error("Erreur lors du chargement des points jaunes:", error);
      }
    }

    fetchYellowPoints();

  }, [year, map]);

  function applyOpacity(hexColor: string, opacity: number) {
    const hex = hexColor.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "800px",
        backgroundColor: "lightgray",
      }}
    >
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      <div
        ref={popupRef}
        style={{
          backgroundColor: "white",
          border: "1px solid black",
          padding: "4px 8px",
          borderRadius: "4px",
          position: "absolute",
          bottom: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          display: "none",
          pointerEvents: "none",
          fontSize: "0.8rem",
        }}
      />
    </div>
  );
};

export default MapComponent;
