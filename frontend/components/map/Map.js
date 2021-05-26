import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import PolylineMeasurer from '@components/map/Leaflet.PolylineMeasure/PolylineMeasurer';
import { calculateZoom, getLatLngCenter } from '@helpers/map.helpers';

import 'leaflet/dist/leaflet.css';
import 'leaflet.polylinemeasure/Leaflet.PolylineMeasure.css';

function Events({ setCurrentRoutes, setSeedRoutes, map }) {
  let currentLines = [];

  const onFinish = useCallback(
    currentLine => {
      currentLines.push(currentLine);
      setCurrentRoutes(currentLines);
    },
    [map],
  );

  const onClear = useCallback(() => {
    setCurrentRoutes();
    currentLines = [];

    setSeedRoutes();
  }, [map]);

  useEffect(() => {
    map.on('polylinemeasure:finish', onFinish);
    map.on('polylinemeasure:clear', onClear);

    if (setCurrentRoutes === undefined && document.getElementById('polyline-measure-control')) {
      document.getElementById('polyline-measure-control').style.display = 'none';
    } // turn off polyline-measure-control when in read only map view i.e. announcements list
  }, [map]);

  return null;
}

const Map = ({ setCurrentRoutes, setSeedRoutes, seedRoutes }) => {
  const [map, setMap] = useState(null);

  const center = seedRoutes && seedRoutes.length > 0 ? getLatLngCenter(seedRoutes) : [52.11, 19.21];
  const zoom = seedRoutes && seedRoutes.length > 0 ? calculateZoom(seedRoutes) : 5;

  return (
    <>
      <MapContainer
        whenCreated={setMap}
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}>
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
          showClearControl={setCurrentRoutes === undefined ? false : true}
          bearingTextIn="In"
          bearingTextOut="Out"
          seedData={seedRoutes}
          key={seedRoutes} //provide random key just to force leaflet reload for Nextjs ASO
        />
      </MapContainer>
      {map ? (
        <Events setCurrentRoutes={setCurrentRoutes} setSeedRoutes={setSeedRoutes} map={map} />
      ) : null}
    </>
  );
};

export default Map;
