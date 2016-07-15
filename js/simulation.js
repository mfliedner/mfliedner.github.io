const Needle = require('./needle');

const Simulation = function(c, w, h) {
  this.context = c;
  this.width  = w;
  this.height = h;

  this.nboards = 8;
  this.interval = Math.floor(this.height / this.nboards);
  this.needleLength = this.interval;

  this.count = 0;
  this.hit = 0;
  this.running = false;
  this.max = 0;
};

// generates empty grid of `nboards` horizontally
// oriented floor boards on canvas
Simulation.prototype.setGrid = function () {
  const ctx = this.context;
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 1;
  ctx.clearRect(0, 0, this.width, this.height);
  ctx.beginPath();
  for (let i = 1; i < this.nboards; i++) {
    ctx.moveTo(0, i*this.interval);
    ctx.lineTo(this.width, i*this.interval);
    ctx.stroke();
  }
}

// inititiates needle drop simulation on Grid
Simulation.prototype.run = function () {

  // set up canvas with horizontal with `nboards` floor boards
  this.setGrid();

  const self = this;

  // start simulation
  document.getElementById('start').addEventListener('click', function()
    {
      self.running = true;
      setTimeout(self.dropNeedle.bind(self), 200);
    }
  );

  // stop simulation
  document.getElementById('stop').addEventListener('click', function()
    {
      self.running = false;
    }
  );

  // reset simulation
  document.getElementById('new').addEventListener('click', function()
    {
      self.running = false;
      self.count = 0;
      self.hit = 0;
      self.showStats();

      // reset grid to empty
      self.setGrid();

      setTimeout(self.dropNeedle.bind(self), 200);
    }
  );

  // run fixed length simulation
  document.getElementById('max').addEventListener('click', function()
    {
      self.max = document.getElementById('max').value;
    }
  );
};

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

// report updated result on document
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

module.exports = Simulation;
