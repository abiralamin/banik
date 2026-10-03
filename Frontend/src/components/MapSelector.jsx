import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in React Leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map center changes
const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);
  return null;
};

const MapSelector = ({ initialCenter, initialPosition, onPositionChange, readOnly = false }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (initialPosition) {
      // Ensure coordinates are numbers, not strings
      const normalizedPosition = [
        typeof initialPosition[0] === 'string' ? parseFloat(initialPosition[0]) : initialPosition[0],
        typeof initialPosition[1] === 'string' ? parseFloat(initialPosition[1]) : initialPosition[1]
      ];
      setPosition(normalizedPosition);
    }
  }, [initialPosition]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (readOnly) return;
        const newPos = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
        onPositionChange(newPos);
      },
    });
    return null;
  };

  // Normalize center coordinates to numbers
  const normalizeCenter = (coords) => {
    if (!coords) return null;
    return [
      typeof coords[0] === 'string' ? parseFloat(coords[0]) : coords[0],
      typeof coords[1] === 'string' ? parseFloat(coords[1]) : coords[1]
    ];
  };

  // Center should be stable - use initialCenter, or zoneCenter, or initialPosition for first load, or default
  // Do NOT use current position as center as this causes map to re-center when pin moves
  const center = normalizeCenter(initialCenter) || normalizeCenter(initialPosition) || [23.8103, 90.4125];

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-slate-200">
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <MapCenterUpdater center={normalizeCenter(initialCenter)} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!readOnly && <MapClickHandler />}
        {position && (
          <Marker
            position={position}
            draggable={!readOnly}
            eventHandlers={{
              dragend: (e) => {
                if (!readOnly) {
                  const newPos = [e.target.getLatLng().lat, e.target.getLatLng().lng];
                  setPosition(newPos);
                  onPositionChange(newPos);
                }
              },
            }}
          />
        )}
      </MapContainer>
      {!readOnly && (
        <div className="mt-2 text-xs text-slate-500">
          Click on the map to place the location pin. You can drag the pin to adjust the exact position.
        </div>
      )}
    </div>
  );
};

export default MapSelector;
