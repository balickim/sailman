import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import PolylineMeasurer from "./Leaflet.PolylineMeasure/PolylineMeasurer";
import { polylines } from "./data";

import "leaflet/dist/leaflet.css";
import "leaflet.polylinemeasure/Leaflet.PolylineMeasure.css";

const Map = () => {
  return (
    <MapContainer
      center={[52.11, 19.21]}
      zoom={6}
      scrollWheelZoom={true}
      style={{ height: 600, width: "50%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <PolylineMeasurer
        position="topleft"
        clearMeasurementsOnStop={false}
        unit="nauticalmiles"
        showUnitControl="true"
        showBearings="true"
        showClearControl="true"
        bearingTextIn="In"
        bearingTextOut="Out"
        seedData={polylines}
      />
    </MapContainer>
  );
};

export default Map;
