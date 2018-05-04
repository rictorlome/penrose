function vectorBetween(a,b) {
  return createVector(b.x-a.x, b.y - a.y);
}
function midpoint(a,b) {
  return p5.Vector.lerp(a,b,0.5);
}

function vectorFromMagAndAngle(mag,angle) {
  angleMode(DEGREES)
  const x = mag * cos(angle);
  const y = mag * sin(angle);
  return createVector(x,y)
}
