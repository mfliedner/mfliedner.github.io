# BuffonNeedle
Simulation of Buffon's Needle experiment as a probabilistic approach to
estimate the value of &pi;.

[Live][github]

[github]: https://mfliedner.github.io/

![screen shot] (./docs/buffon.png)

## Introduction

Georges-Louis Leclerc, Comte de Buffon (1707-1788) in the 18th century posed and solved
the very first problem of geometric probability. A needle of a given length L is tossed
on a wooden floor with evenly spaced cracks, distance D apart. What is the probability
of the needle hitting a crack? (The problem is nowadays known as Buffon's Needle problem.)
The answer he discovered with the help of integral calculus is given by the simple formula

P = 2L/&pi;

With P approximated by the ratio of hits to the total number of tosses, the formula offers a way
of evaluating &pi;, an observation that eventually led Pierre Simon Laplace (1749-1827) to propose
a method, known today as the Monte Carlo Method, for numerical evaluation of various quantities
by realizing appropriate random events.

[Reference]: http://www.cut-the-knot.org/ctk/August2001.shtml from the "Math Surprises"
blog by Alex Bogomolny.

## Instructions

Start or resume a simulation with the `Start` button. Unless you enter a
`Number of Tosses` larger than 0, the simulation runs until you hit the
`Stop` button.

Create a new simulation ("Restart") with the `New` button.

## Implementation

### Canvas

There are many implementations of the basic simulation logic for Buffon's
Needle. This canvas and its traffic-light color scheme are based on the
animation by Oliver Knill at Harvard (http://www.math.harvard.edu/~knill).
Needles that cross the yellow floor board cracks are marked green (hits),
those falling in between are marked red (misses).

The canvas is of fixed size for drawing purposes,

```html
<canvas width="1200" height="800" id="canvas" class="buffon"></canvas>
 ```

but can be resized using CSS percentage width and height.

### View Controller

Within the main `$(document).ready()` function, the `View` function controls
the entire display by intializing the JQuery UI control elements and running
the main simulation on the canvas:

```javascript
const View = function (canvas) {
  this.context = canvas.getContext('2d');
  this.width = canvas.width;
  this.height = canvas.height;
}

View.prototype.init = function() {
  $( ".panel" ).draggable();
  $('#hide_introduction').click(function() {
    $("#introduction_panel").slideUp();
  });
  $('#hide_instructions').click(function() {
    $('#instructions_panel').slideUp();
  });
};

View.prototype.run = function() {
  const simulation = new Simulation(this.context, this.width, this.height);
  simulation.run();
};
 ```

### Simulation

The `Simulation` function sets up the canvas display grid and listeners
for the control elements `start`, `stop`, `new`, and `max` (number of tosses).

Its main function is a recursive callback of the needle drop simulation:

```javascript
Simulation.prototype.dropNeedle = function () {
  let hit = false;
  const needle = new Needle(this.context, this.width, this.height,
                            this.interval, this.needleLength);

  if (this.max > 0 && this.count >= this.max) {
    this.running = false;
  }

  if (this.running) {
    this.count++;

    needle.add();
    hit = needle.hit();
    if (hit) {
      this.hit++;
    }
    needle.draw();

    this.showStats();

    setTimeout(this.dropNeedle.bind(this), 10);
  }
};
 ```
For each drop rendering it returns the resulting statistical information
to the `index.html` page:

```javascript
Simulation.prototype.showStats = function() {
    const miss = this.count - this.hit;
    let fraction = 1;
    if (this.count > 0) {
      fraction = this.hit / this.count;
    }
    let estimate = 2 * this.needleLength / this.interval / fraction;
    estimate = estimate.toFixed(7);
    document.getElementById('count').innerHTML = this.count;
    document.getElementById('hits').innerHTML = this.hit;
    document.getElementById('misses').innerHTML = miss;
    document.getElementById('estimate').innerHTML = estimate;
};
 ```

The needle drop rendering itself is handled by the Needle function, which
adds a new needle at a random location in a random orientation on the canvas
and then determines whether it is a hit (crossing a crack) or miss (landing
in between or inside cracks).

### Control Elements

Floating semi-transparently on top of the canvas are the simulation controls,
the results panel and two information panels (introduction and instructions).

This panels can be moved inside the window and the information panels can
be closed to free up window space.  This is realized with JQuery UI
Draggable and slideUp components in the `View.init()` function.
