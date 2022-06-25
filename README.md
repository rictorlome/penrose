# Penrose Tiles

![Screenshot](https://raw.githubusercontent.com/rictorlome/penrose/master/images/penrose_screenshot.png)

### [Live Link](https://rictorlome.github.io/penrose/)

An implementation of Penrose tiling, written using the [p5.js](https://p5js.org/) library.
The following article was a great resource in understanding how to represent tiling recursively: [Hidden Beauty in Penrose Tiling: Wavings & Lace](http://archive.bridgesmathart.org/2017/bridges2017-213.pdf)

## Description

Penrose tiling is an example of non-periodic tiling. The way I think of it is - if you slide a window over the pattern, you will never see the same image repeated.

This emergent property is surprising because the entire pattern is composed of two basic elements - the kite and the dart - with fixed rules for tiling. Using the below example as a reference: the edges marked with red sectors can only be tiled against other red edges, and vice versa for green.

![Link to Wikipedia image](https://upload.wikimedia.org/wikipedia/commons/d/d6/Kite_Dart.svg)


## Code

In this implementation, tile construction relies on recursive definitions of JavaScript classes. The Kite and Dart objects each half into two HalfKite and HalfDart objects. The HalfKite and HalfDart objects each have a subdivide method which constructs new HalfKites and HalfDarts according to the image below. The construction logic is totally separate from the p5 render logic, so that the same general class structure can be used with any rendering library.

![Link from http://archive.bridgesmathart.org/2017/bridges2017-213.pdf](https://raw.githubusercontent.com/rictorlome/penrose/master/images/tiling%20pattern.jpg)

```javascript
class HalfKite {
  constructor(...) {
    ...
  }
  subdivide() {
    const parentKite = this.kite;
    const babyKite = new Kite(parentKite.center,vectorBetween(parentKite.center,parentKite.pointFromSide(this.side)));
    const dart = new Dart(parentKite.tail,vectorBetween(parentKite.tail,babyKite.pointFromOtherSide(this.side)));
    return [new HalfKite(babyKite,LEFT,1), new HalfKite(babyKite,RIGHT,2), new HalfDart(dart,opposite(this.side),3)];
  }
```
Each recursion depth is stored in a HashMap mapping level to the array of shapes constructed at that level. Based on which depth you want to see, the render logic iterates through the appropriate array and renders all the shapes in that array.

The appearance of tiling is actually an illusion because all the tiles, for every depth up to the maximum depth, already exist in their respective arrays with predetermined positions on the screen. The reveal is effected by a separate, customizable ```revealCurve``` function which describes a moving frontier ahead of which the tiles do not render.

```javascript
function revealCurve(point) {
  var x = point.x;
  var y = point.y;
  return x + y * Math.sin(revealSlider.value() * x);
}
```
## Controls

On the live link, press on the hamburger to open up the control menu.

The current controls allow you to modify:

1. The recursion depth of the render (how many tiles appear on the screen)
2. The speed with which they are revealed
3. The paraboloid function (which changes the reveal pattern)
4. The colors of each label (1-5 as per the image above)

I intend to add controls for the initialization shape. There are 7 shapes in which the primary shapes can meet at a point (from top to bottom, left to right): the star, the ace, the sun, the king, the jack, the queen, the duece. Right now, the pattern is always initialized with the star.

![Link to Wikipedia Image](https://upload.wikimedia.org/wikipedia/commons/2/26/Penrose_vertex_figures.svg)

I also intend to add some randomness to the placement of the initial shape, in order to increase the variety of the patterns.
