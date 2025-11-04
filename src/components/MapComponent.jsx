import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Importar o Leaflet
import 'leaflet/dist/leaflet.css';

// --- Corrigir o ícone padrão do Leaflet ---
// (O Vite pode ter problemas a encontrar os ícones padrão)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- Fim da correção do ícone ---


// 1. Aceitar latitude e longitude como props
const MapComponent = ({ latitude, longitude }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // 2. Definir posição inicial (pode ser a primeira coordenada ou um padrão)
  const initialPosition = [latitude || -1.477288, longitude || -48.453991];

  // 3. Efeito para atualizar o mapa quando os dados chegam
  useEffect(() => {
    // Se a posição recebida for válida
    if (latitude != null && longitude != null) {
      const newPosition = [latitude, longitude];
      
      // Se o mapa já foi criado, mover o centro
      if (mapRef.current) {
        mapRef.current.setView(newPosition, mapRef.current.getZoom());
      }
      // Se o marcador já foi criado, mover o marcador
      if (markerRef.current) {
        markerRef.current.setLatLng(newPosition);
      }
    }
  }, [latitude, longitude]); // Este efeito corre sempre que lat/lng mudam

  return (
    <MapContainer 
      center={initialPosition} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      whenCreated={map => { mapRef.current = map; }} // 4. Guardar a instância do mapa
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
          OpenStreetMap
        </a> contributors'
      />

      <TileLayer
        url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
        attribution='Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
      />

      {/* 5. Usar a posição inicial e guardar a ref do marcador */}
      <Marker 
        position={initialPosition} 
        ref={markerRef}
      >
        <Popup>Posição Atual</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
