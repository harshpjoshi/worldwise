import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContexts";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";

function Map() {
  const { cities } = useCities();

  const [currentPosition, setCurrentPosition] = useState([30, 0]);

  const [searchParams, setSearchParams] = useSearchParams();

  const { isLoading, position, error, getPosition } = useGeolocation();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("long");

  useEffect(
    function () {
      if (lat && lng) setCurrentPosition([lat, lng]);
      console.log(`lat, lng   ==== ${lat},${lng}`);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      console.log(position);
      if (position) setCurrentPosition([position.lat, position.lng]);
      console.log(`position   ==== ${lat},${lng}`);
    },
    [position]
  );

  return (
    <div className={styles.mapContainer}>
      {!position && (
        <Button type="position" onClick={getPosition}>
          {isLoading ? "Loading..." : "Use Current Location"}
        </Button>
      )}
      <MapContainer
        // center={[lat, lng]}
        center={currentPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <DetectClick />
        {<ChangeCenter position={currentPosition} />}
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&long=${e.latlng.lng}`);
    },
  });
  return null;
}

export default Map;
