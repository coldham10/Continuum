export function rToFormDays(r) {
  //From r value of geometric function to number of habit formation days
  return Math.round(Math.log(1 - r) / Math.log(r));
}

export function raToLossDays(r, a) {
  //Convert r & a values from habit function to Loss/dropoff days
  let fd = rToFormDays(r);
  let z = Math.log(a) / Math.log(r);
  return Math.round(fd - z);
}

export function displayPositiveMomentum(val, max) {
  return 0.1 * Math.min(1, val) + 0.9 * Math.max(0, (val - 1) / (max - 1));
}
