import { MapContainer, TileLayer, Marker } from "react-leaflet";
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

const MapView = ({ center, position }) => {
  // Ensure coordinates are numbers, not strings
  const mapCenter = center ? [
    typeof center[0] === 'string' ? parseFloat(center[0]) : center[0],
    typeof center[1] === 'string' ? parseFloat(center[1]) : center[1]
  ] : [23.8103, 90.4125]; // Default to Dhaka

  const markerPosition = position ? [
    typeof position[0] === 'string' ? parseFloat(position[0]) : position[0],
    typeof position[1] === 'string' ? parseFloat(position[1]) : position[1]
  ] : null;

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border border-slate-200">
      <MapContainer
        center={mapCenter}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerPosition && (
          <Marker position={markerPosition} />
        )}
      </MapContainer>
      {markerPosition && (
        <div className="mt-2 text-xs text-slate-500">
          Green pin shows your assigned vending location.
        </div>
      )}
    </div>
  );
};

export default MapView;
