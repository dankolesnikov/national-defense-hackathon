import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 48.3794,
  lng: 31.1656,
};

const kramatorsk = {
  lat: 48.738968,
  lng: 37.584351,
};

const berdyansk = {
  lat: 46.7738,
  lng: 36.8035,
};

const mariuopol = {
  lat: 47.0971,
  lng: 37.5434,
};

const MyComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDb2JU6weneGJyiYB0sBBBbF6ZPYFg3WaQ",
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={kramatorsk} label="Kramatorsk" />
      <Marker position={berdyansk} label="Berdyansk" />
      <Marker position={mariuopol} label="Mariuopol" />
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MyComponent;
