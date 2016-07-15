const Needle = function(c, w, h, D, L) {
  this.ctx = c;
  this.width  = w;
  this.height = h;
  this.interval = D;
  this.needleLength = L;

  this.x1 = 0;
  this.y1 = 0;
  this.x2 = 0;
  this.y2 = 0;
};

// generate new needle with random position and orientation
Needle.prototype.add = function () {
  const r = this.needleLength / 2;
  const yrange = this.interval / 2.0 + this.height;

  // random center coordinates
  const x = Math.floor(this.width * Math.random());
  const y = Math.floor(yrange * Math.random());
  const phi = 2 * Math.PI * Math.random();

  // end points
  this.x1 = x - r * Math.cos(phi);
  this.y1 = y - r * Math.sin(phi);
  this.x2 = x + r * Math.cos(phi);
  this.y2 = y + r * Math.sin(phi);
};

// determine hit (crosses boundary between boards) or miss
Needle.prototype.hit = function () {
  const y1a = Math.floor(this.y1 + this.interval) % (2*this.interval);
  const y2a = Math.floor(this.y2 + this.interval) % (2*this.interval);
  if ( (y1a - this.interval) * (y2a - this.interval) < 0 ) {
    this.ctx.strokeStyle = "green"; // hit
    return true;
  } else {
    this.ctx.strokeStyle = "red"; // miss
    return false;
  }
};

// draw new needle with appropriate color
Needle.prototype.draw = function () {
  this.ctx.lineWidth = 1;
  this.ctx.beginPath();
  this.ctx.moveTo(Math.floor(this.x1), Math.floor(this.y1));
  this.ctx.lineTo(Math.floor(this.x2), Math.floor(this.y2));
  this.ctx.stroke();
};

module.exports = Needle;
