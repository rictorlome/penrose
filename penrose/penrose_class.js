// http://archive.bridgesmathart.org/2017/bridges2017-213.pdf
const depth = 0;
const LEFT = true;
const RIGHT = false;
const ratio = 2*Math.sin(Math.PI/10);

function opposite(side) {
  return !side;
}

class Kite {
  constructor(point,vector) {
    this.tip = point;
    this.tail = p5.Vector.add(point,vector);
    this.vector = vector;
    this.center = p5.Vector.lerp(this.tail,this.tip,ratio);
    this.pointFromLeftSide = this.slowPointFromSide(LEFT);
    this.pointFromRightSide = this.slowPointFromSide(RIGHT);
  }
  half(side) {
    return new HalfKite(this,side);
  }
  slowPointFromSide(side) {
    const copyVec = this.vector.copy();
    angleMode(DEGREES);
    side === RIGHT ? copyVec.rotate(216) : copyVec.rotate(-216);
    return copyVec.add(this.tail);
  }
  pointFromSide(side) {
    return (side === RIGHT ? this.pointFromRightSide : this.pointFromLeftSide);
  }
  pointFromOtherSide(side) {
    return this.pointFromSide(!side);
  }
  render() {
    triangle(this.tip.x,this.tip.y,this.tail.x,this.tail.y,this.pointFromSide(LEFT).x,this.pointFromSide(LEFT).y)
    triangle(this.tip.x,this.tip.y,this.tail.x,this.tail.y,this.pointFromSide(RIGHT).x,this.pointFromSide(RIGHT).y)
  }
}
class Dart {
  constructor(point,vector) {
    this.tip = point;
    this.tail = p5.Vector.add(point,vector);
    this.vector = vector;
    this.pointFromLeftSide = this.slowPointFromSide(LEFT);
    this.pointFromRightSide = this.slowPointFromSide(RIGHT);
  }
  half(side) {
    return new HalfDart(this,side);
  }
  slowPointFromSide(side) {
    const copyVec = this.vector.copy();
    angleMode(DEGREES);
    side === RIGHT ? copyVec.rotate(72) : copyVec.rotate(-72);
    return copyVec.add(this.tail);
  }
  pointFromSide(side) {
    return (side === RIGHT ? this.pointFromRightSide : this.pointFromLeftSide);
  }
  render() {
    triangle(this.tip.x,this.tip.y,this.tail.x,this.tail.y,this.pointFromSide(LEFT).x,this.pointFromSide(LEFT).y)
    triangle(this.tip.x,this.tip.y,this.tail.x,this.tail.y,this.pointFromSide(RIGHT).x,this.pointFromSide(RIGHT).y)
  }
}

class HalfKite {
  constructor(kite,side,label) {
    this.kite = kite;
    this.side = side;
    this.label = label;
  }
  subdivide() {
    const parentKite = this.kite;
    const babyKite = new Kite(parentKite.center,vectorBetween(parentKite.center,parentKite.pointFromSide(this.side)));
    const dart = new Dart(parentKite.tail,vectorBetween(parentKite.tail,babyKite.pointFromOtherSide(this.side)));
    return [new HalfKite(babyKite,this.side,1), new HalfKite(babyKite,opposite(this.side),2), new HalfDart(dart,opposite(this.side),3)];
  }
  render() {
    fill(config[this.label])
    const parentKite = this.kite;
    const pointFromSide = parentKite.pointFromSide(this.side);
    triangle(parentKite.tip.x,parentKite.tip.y,pointFromSide.x,pointFromSide.y,parentKite.tail.x,parentKite.tail.y);
  }
  tip() {
    return this.kite.tip;
  }
}
class HalfDart {
  constructor(dart,side,label) {
    this.dart = dart;
    this.side = side;
    this.label = label;
  }
  subdivide() {
    const parentDart = this.dart;
    const sidePoint = parentDart.pointFromSide(this.side);
    const babyKite = new Kite(parentDart.tail,p5.Vector.mult(parentDart.vector,-1))
    const babyDart = new Dart(sidePoint,vectorBetween(sidePoint,babyKite.pointFromSide(this.side)));
    return [new HalfKite(babyKite,this.side,4), new HalfDart(babyDart,this.side,5)]
  }
  render() {
    fill(config[this.label])
    const parentDart = this.dart;
    const pointFromSide = parentDart.pointFromSide(this.side);
    triangle(parentDart.tip.x,parentDart.tip.y,pointFromSide.x,pointFromSide.y,parentDart.tail.x,parentDart.tail.y);
  }
  tip() {
    return this.dart.tip;
  }
}
