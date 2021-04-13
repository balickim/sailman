import { MapControl, withLeaflet } from "react-leaflet";
import * as L from "leaflet";

class PolylineMeasure extends MapControl {
  constructor(props) {
    super(props);
    this.state = {
      data: "www.javatpoint.com",
    };
  }
  createLeafletElement() {
    console.log(this.polylineMeasure);
    return L.control.polylineMeasure({
      position: "topleft",
      unit: "metres",
      showBearings: true,
      clearMeasurementsOnStop: false,
      showClearControl: true,
      showUnitControl: true,
      bearingTextIn: "In",
      bearingTextOut: "Out",
      tooltipTextFinish: "Click to <b>finish line</b><br>",
      tooltipTextDelete: "Press SHIFT-key and click to <b>delete point</b>",
      tooltipTextMove: "Click and drag to <b>move point</b><br>",
      tooltipTextResume: "<br>Press CTRL-key and click to <b>resume line</b>",
      tooltipTextAdd: "Press CTRL-key and click to <b>add point</b>",
    });
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    const polylineMeasure = this.leafletElement;
    polylineMeasure.addTo(map);

    console.log(polylineMeasure);

    polylineMeasure._arrArrows.push({
      lat: 51.82748984628019,
      lng: -24.92955154455108,
    });
  }
}

export default withLeaflet(PolylineMeasure);
