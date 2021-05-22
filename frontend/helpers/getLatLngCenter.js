function rad2degr(rad) {
  return (rad * 180) / Math.PI;
}
function degr2rad(degr) {
  return (degr * Math.PI) / 180;
}
export const getLatLngCenter = latLngInDegr => {
  let coords = [];

  latLngInDegr.map(element => {
    element.map(el => {
      coords.push(el);
    });
  });

  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  for (let i = 0; i < coords.length; i++) {
    let lat = degr2rad(coords[i]['lat']);
    let lng = degr2rad(coords[i]['lng']);
    // sum of cartesian coordinates
    sumX += Math.cos(lat) * Math.cos(lng);
    sumY += Math.cos(lat) * Math.sin(lng);
    sumZ += Math.sin(lat);
  }

  let avgX = sumX / coords.length;
  let avgY = sumY / coords.length;
  let avgZ = sumZ / coords.length;

  // convert average x, y, z coordinate to latitude and longtitude
  let lng = Math.atan2(avgY, avgX);
  let hyp = Math.sqrt(avgX * avgX + avgY * avgY);
  let lat = Math.atan2(avgZ, hyp);

  return [rad2degr(lat), rad2degr(lng)];
};
