import L from 'leaflet';
import './Leaflet.PolylineMeasure';
import { createControlComponent } from '@react-leaflet/core';

const createPolylineMeasurer = props => {
  return L.control.polylineMeasure({ ...props });
};

const PolylineMeasurer = createControlComponent(createPolylineMeasurer);

export default PolylineMeasurer;
