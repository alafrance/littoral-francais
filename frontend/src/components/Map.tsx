// src/components/Map.tsx
import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import OSM from 'ol/source/OSM';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Définition du layer vectoriel pour les points
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        url: 'http://localhost:8000/points.geojson', // API FastAPI ici
        format: new GeoJSON(),
      }),
      style: (feature) => {
        const couleur = feature.get('couleur') || 'gris';
        const opacite = feature.get('opacite') || 0.6;
        const taille = feature.get('taille');

        const couleursRgb: Record<string, string> = {
          rouge: `rgba(255, 0, 0, ${opacite})`,
          bleu: `rgba(0, 0, 255, ${opacite})`,
          vert: `rgba(0, 200, 0, ${opacite})`,
          gris: `rgba(100, 100, 100, ${opacite})`,
        };

        const rayon = taille === 'large' ? 12 : taille === 'small' ? 6 : 8;

        return new Style({
          image: new CircleStyle({
            radius: rayon,
            fill: new Fill({
              color: couleursRgb[couleur] || couleursRgb['gris'],
            }),
            stroke: new Stroke({
              color: '#333',
              width: 1,
            }),
          }),
        });
      },
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([2.35, 46.86]), // Centre France
        zoom: 6,
      }),
    });

    return () => map.setTarget(undefined); // Nettoyage propre
  }, []);

  return <div ref={mapRef} className="map-container" />;
};

export default MapComponent;
