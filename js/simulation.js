const Simulation = function(c) {
  this.width  = 1200;
  this.height = 800;
  this.nboards = 8;
  this.interval = Math.floor(this.height / this.nboards);
  this.needleLength = this.interval;

  this.context = c;
  this.count = 0;
  this.hit = 0;
  this.running = false;
  this.max = 0;
};

Simulation.prototype.grid = function () {
  const ctx = this.context;
  ctx.strokeStyle = "rgba(255,255,0,0.95)";
  ctx.lineWidth = 1;
  ctx.clearRect(0, 0, this.width, this.height);
  ctx.beginPath();
  for (let i = 1; i < this.nboards; i++) {
    ctx.moveTo(0, i*this.interval);
    ctx.lineTo(this.width, i*this.interval);
    ctx.stroke();
  }


  const self = this;

  document.getElementById('start').addEventListener('click', function()
    {
      self.running = true;
      setTimeout(self.needle.bind(self), 200);
    // startSim();
    }
  );
  document.getElementById('stop').addEventListener('click', function()
    {
      self.running = false;
    }
  );
  document.getElementById('new').addEventListener('click', function()
    {
      self.running = false;
      self.count = 0;
      self.hit = 0;
      self.showStats();

      ctx.strokeStyle = "rgba(255,255,0,0.95)";
      ctx.lineWidth = 1;
      ctx.clearRect(0, 0, self.width, self.height);
      ctx.beginPath();
      for (let i = 1; i < self.nboards; i++) {
        ctx.moveTo(0, i*self.interval);
        ctx.lineTo(self.width, i*self.interval);
        ctx.stroke();
      }
      setTimeout(self.needle.bind(self), 200);
    }
  );
  document.getElementById('max').addEventListener('click', function()
    {
      self.max = document.getElementById('max').value;
    }
  );
};

Simulation.prototype.needle = function () {
  const ref = 2 / Math.PI;
  const ctx = this.context;
  const r = this.needleLength / 2;
  const yrange = this.interval / 2.0 + this.height;

  if (this.max > 0 && this.count >= this.max) {
    this.running = false;
  }

  if (this.running) {
    this.count++;
    const x = Math.floor(this.width * Math.random());
    const y = Math.floor(yrange * Math.random());
    const phi = 2 * Math.PI * Math.random();
    const x1 = x - r * Math.cos(phi);
    const y1 = y - r * Math.sin(phi);
    const y1a = Math.floor(y1 + this.interval) % (2*this.interval);
    const x2 = x + r * Math.cos(phi);
    const y2 = y + r * Math.sin(phi);
    const y2a = Math.floor(y2 + this.interval) % (2*this.interval);
    if ( (y1a - this.interval) * (y2a - this.interval) < 0 ) {
      this.hit++;
      ctx.strokeStyle = "rgb(0,255,0)";
    } else {
      ctx.strokeStyle = "rgb(255,0,0)";
    }
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.floor(x1), Math.floor(y1));
    ctx.lineTo(Math.floor(x2), Math.floor(y2));
    ctx.stroke();
    ctx.clearRect(0, this.height, this.width, this.height);

    this.showStats();

    setTimeout(this.needle.bind(this), 10);
  }
};

Simulation.prototype.showStats = function() {
    const miss = this.count - this.hit;
    let fraction = 1;
    if (this.count > 0) {
      fraction = this.hit / this.count;
    }
    const estimate = 2 * this.needleLength / this.interval / fraction;
    document.getElementById('count').innerHTML = this.count;
    document.getElementById('hits').innerHTML = this.hit;
    document.getElementById('misses').innerHTML = miss;
    document.getElementById('estimate').innerHTML = estimate;
};

module.exports = Simulation;
