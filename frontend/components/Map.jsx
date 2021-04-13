import { Map, TileLayer } from "react-leaflet";
import PolylineMeasure from "./PolylineMeasure";

import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.css";
import "leaflet.polylinemeasure/Leaflet.PolylineMeasure.css";
import "leaflet.polylinemeasure/Leaflet.PolylineMeasure";

const Leaflet = () => {
  return (
    <>
      <Map
        center={[52.11, 19.21]}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: 600, width: "50%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PolylineMeasure />
      </Map>
    </>
  );
};

export default Leaflet;
