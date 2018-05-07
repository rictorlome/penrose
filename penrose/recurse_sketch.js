var depthSlider;
var revealSlider;
var speedSlider;
var colorSliders;


var config;
var curTime;
var TIME_OFFSET = 0;

const MAX_DEPTH = 8;
const FRAME_RATE = 12;
const depthToShapes = {};

p5.disableFriendlyErrors = true;

function setup() {
  createCanvas(displayWidth,displayHeight)
  let menu = document.getElementById('menu')
  depthSlider = createSlider(1,MAX_DEPTH,7);
  depthSlider.parent(document.getElementById('depth'))
  revealSlider = createSlider(1,10,5);
  revealSlider.parent(document.getElementById('reveal'))
  speedSlider = createSlider(2,10,3);
  speedSlider.parent(document.getElementById('speed'))

  colorSliders = initializeColorSliders(menu)
  button = createButton('Reset');
  button.parent(document.getElementById('reset'))
  button.mousePressed( () => TIME_OFFSET = curTime)
  document.addEventListener('keypress', (e) => {
    if (e.key === 'r') TIME_OFFSET = curTime;
  })
  config = {
    1: color('white'),
    2: color('grey'),
    3: color('grey'),
    4: color('white'),
    5: color('pink')

    // 1: color('purple'),
    // 2: color('green'),
    // 3: color('pink'),
    // 4: color('orange'),
    // 5: color('blue')
  }
  frameRate(FRAME_RATE)

  const center = createVector(width/2,height/2);
  const length = width*2/3;
  const halves = halfShapes(initializeSun(center,length));
  depthToShapes[0] = halves;
}
function draw() {
  clear()
  background('black');
  strokeWeight(1/(2*depthSlider.value()))
  curTime = frameCount / FRAME_RATE;
  const shapes = shapesAtDepth(depthToShapes,depthSlider.value())
  const length = shapes.length;
  for (let i = 0; i < length; i++) {
    const shape = shapes[i];
    if (isVisible(shape.tip(),curTime-TIME_OFFSET)) shape.render()
  }
}

function initializeStar(center,length) {
  angleMode(DEGREES);
  const shapes = [];
  for (let i = 1; i <= 5; i++) {
    const angle = (360 / 5) * i;
    const newVec = vectorFromMagAndAngle(length,angle)
    newVec.rotate(angle)
    shapes.push(new Dart(center,newVec));
  }
  return shapes;
}
function initializeSun(center,length) {
  angleMode(DEGREES);
  const shapes = [];
  for (let i = 1; i <= 5; i++) {
    const angle = (360 / 5) * i;
    const newVec = vectorFromMagAndAngle(length,angle)
    newVec.rotate(angle)
    shapes.push(new Kite(p5.Vector.add(center,newVec),p5.Vector.mult(newVec,-1)));
  }
  return shapes;
}
function initializeKing(center,length) {
  angleMode(DEGREES);
}
function halfShapes(shapes) {
  const arr = [];
  shapes.forEach( (shape) => {
    arr.push(shape.half(LEFT));
    arr.push(shape.half(RIGHT));
  })
  return arr;
}
function shapesAtDepth(map, depth) {
  if (Boolean(map[depth])) return map[depth];
  const prevShapes = shapesAtDepth(map,depth-1);
  const newDepth = [];
  prevShapes.forEach( (shape) => {
    shape.subdivide().forEach( (subShape) => {
      newDepth.push(subShape);
    });
  });
  map[depth] = newDepth;
  return newDepth;
}
function timeSubmerged(point,func) {
  const newPoint = createVector(point.x/width,point.y/height);
  const fracTime = func(newPoint);
  return fracTime * speedSlider.value();
}
function paraboloid(point) {
  var x = point.x;
  var y = point.y;
  return x + y * Math.sin(revealSlider.value() * x);
}
function isVisible(point, time=0) {
  return timeSubmerged(point,paraboloid) < time;
}

function initializeColorSliders(menu) {
  let colorSliders = []
  for (let i = 0; i < 5; i++) {
    let h = 120 + (30 * i)
    colorSliders[i] = createSlider(0,105,i*5)
    colorSliders[i].parent(document.getElementById('color'+String(i+1)))
    colorSliders[i].input((change) => {
      config[i+1] = color('#' + hsh[colorSliders[i].value()])
    })
  }
  return colorSliders
}
