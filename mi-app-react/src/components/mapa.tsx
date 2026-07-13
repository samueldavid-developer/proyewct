import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Corrección de iconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  // Cambiamos el tipo para que reciba un string (la dirección)
  onConfirm: (direccion: string) => void;
}

interface LocationMarkerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onLocationSelect }: LocationMarkerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ isOpen, onClose, onConfirm }: MapPickerProps) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleConfirm = async () => {
    if (!coords) return;
    
    try {
      // Llamamos a la API de Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      // Pasamos la dirección legible al padre
      onConfirm(data.display_name || `${coords.lat}, ${coords.lng}`);
    } catch (error) {
      onConfirm(`${coords.lat}, ${coords.lng}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl h-[500px] flex flex-col shadow-2xl">
        <h3 className="mb-4 text-lg font-bold text-slate-800">Selecciona tu punto en Madrid</h3>
        <div className="flex-1 rounded-xl overflow-hidden border border-slate-200">
          <MapContainer center={new L.LatLng(40.4168, -3.7038)} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker onLocationSelect={(lat, lng) => setCoords({ lat, lng })} />
          </MapContainer>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-100 rounded-xl">Cancelar</button>
          <button onClick={handleConfirm} disabled={!coords} className="px-6 py-2.5 bg-rose-500 text-white rounded-xl disabled:opacity-50">
            Confirmar ubicación
          </button>
        </div>
      </div>
    </div>
  );
}