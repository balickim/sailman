function dist(p1, p2) {
  var x0 = p1[0] - p2[0];
  var y0 = p1[1] - p2[1];
  return x0 * x0 + y0 * y0;
}

function rad2degr(rad) {
  return (rad * 180) / Math.PI;
}
function degr2rad(degr) {
  return (degr * Math.PI) / 180;
}

const maxDist = p => {
  var n = p.length;
  var maxm = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      maxm = Math.max(maxm, dist(p[i], p[j]));
    }
  }
  return Math.sqrt(maxm);
};

function calculateZoom(seedRoutes) {
  let cleanArray = [];

  cleanArray = seedRoutes[0].map(x => {
    return [x.lat, x.lng];
  });

  let distance = maxDist(cleanArray);
  let range = [];
  let mappedValues = 1600;

  for (let i = 1; i < 15; i++) {
    mappedValues = mappedValues / 4.5;
    range.push([i, mappedValues]);
  }

  const closest = range.reduce((a, b) => {
    return Math.abs(b[1] - distance) < Math.abs(a[1] - distance) ? b : a;
  });

  return closest[0];
}

const getLatLngCenter = latLngInDegr => {
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

export { getLatLngCenter, calculateZoom };
