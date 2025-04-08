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
import axios from "axios";

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
  pulseRedPoints?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ activeSets, year, pulseRedPoints = true }) => {
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

    Object.values(layersRef.current).forEach(layer => {
      map.removeLayer(layer);
    });
    layersRef.current = {};

    activeSets.forEach((setName) => {
      if (setName === "yellow") return;

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

      // 🎯 Si rouge, ajouter l'effet de pulse si activé
      if (setName === "red" && pulseRedPoints) {
        vectorLayer.on('postrender', (event) => {
          const frameState = event.frameState;
          const elapsed = frameState.time % 1000; // cyclique 0-1000 ms
          const scale = 1 + 0.05 * Math.sin((elapsed / 1000) * 2 * Math.PI); // Pulse doux

          vectorSource.getFeatures().forEach((feature) => {
            const geom = feature.getGeometry();
            if (geom instanceof CircleGeometry) {
              const originalRadius = feature.get("originalRadius") || geom.getRadius();
              geom.setRadius(originalRadius * scale);
              feature.set("originalRadius", originalRadius); // Stock une fois
            }
          });

          map.render(); // Forcer rafraîchissement
        });
      }

      layersRef.current[setName] = vectorLayer;
      map.addLayer(vectorLayer);
    });

    if (activeSets.includes("yellow")) {
      const yellowLayer = new VectorLayer({
        source: new VectorSource(),
      });
      layersRef.current["yellow"] = yellowLayer;
      yellowLayer.setOpacity(0);
      map.addLayer(yellowLayer);

      generateYellowPoints(year);
    }

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

  }, [activeSets, map, pulseRedPoints]);

  useEffect(() => {
    if (!map) return;
    if (!layersRef.current["yellow"]) return;

    generateYellowPoints(year);

  }, [year, map]);

  async function generateYellowPoints(year: number) {
    const yellowLayer = layersRef.current["yellow"];
    if (!yellowLayer) return;

    const yellowSource = yellowLayer.getSource();
    if (!yellowSource) return;

    yellowSource.clear();

    try {
      const yellowPoints: PointData[] = simulateBackendYellowPoints(year);

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

      yellowSource.addFeatures(newFeatures);

      // 🚀 Animation fade-in
      yellowLayer.setOpacity(0);
      let opacity = 0;
      const fadeInterval = setInterval(() => {
        opacity += 0.1;
        yellowLayer.setOpacity(opacity);
        if (opacity >= 1) {
          clearInterval(fadeInterval);
        }
      }, 30); // 300ms

    } catch (error) {
      console.error("Erreur lors de la génération des points jaunes:", error);
    }
  }

  function applyOpacity(hexColor: string, opacity: number) {
    const hex = hexColor.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  function simulateBackendYellowPoints(year: number): PointData[] {
    const baseCount = 10 + Math.floor((year - 1800) / 10);
    return Array.from({ length: baseCount }).map(() => ({
      lon: -5 + Math.random() * 10,
      lat: 43 + Math.random() * 5,
      sizeKm: 5 + Math.random() * 20,
      opacity: 1.0,
    }));
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(70vh )",  // Carte prend une fraction la hauteur
      }}
    >
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "85%",
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
      {/* Timeline */}
      <div
        className="timeline-container"
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: "#ddd",
          position: "absolute",
          bottom: "50px",  // Espacement du bas
        }}
      >
        <div
          className="timeline"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#333",
          }}
        />
      </div>

      {/* Étiquette de nombre de points */}
      <div
        className="points-label"
        style={{
          position: "absolute",
          bottom: "10px",  // Position juste au-dessus de la timeline
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          padding: "5px 10px",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        <strong>Total : 23 zones</strong>
      </div>
    </div>
  );
};

export default MapComponent;
