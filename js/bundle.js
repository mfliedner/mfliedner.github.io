/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const View = __webpack_require__(1);
	
	$(document).ready(function() {
	  const canvas = document.getElementById('canvas');
	  if (canvas.getContext) {
	    const buffon_view = new View(canvas);
	    buffon_view.init();
	    buffon_view.run();
	  } else {
	    window.alert("This browser does not support canvas");
	  }
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Simulation = __webpack_require__(2);
	
	const View = function (canvas) {
	  this.context = canvas.getContext('2d');
	  this.width = canvas.width;
	  this.height = canvas.height;
	}
	
	View.prototype.init = function() {
	  $( ".panel" ).draggable();
	  $( "#introduction_body" ).hide();
	  document.getElementById('hide_introduction').innerHTML = "show";
	  $('#hide_introduction').click(function() {
	    if ( $( "#introduction_body" ).is( ":hidden" ) ) {
	      $( "#introduction_body" ).show( "slow" );
	      document.getElementById('hide_introduction').innerHTML = "hide";
	    } else {
	      $( "#introduction_body" ).slideUp();
	      document.getElementById('hide_introduction').innerHTML = "show";
	    }
	  });
	  document.getElementById('hide_instructions').innerHTML = "hide";
	  $('#hide_instructions').click(function() {
	    if ( $( "#instructions_body" ).is( ":hidden" ) ) {
	      $( "#instructions_body" ).show( "slow" );
	      document.getElementById('hide_instructions').innerHTML = "hide";
	    } else {
	      $( "#instructions_body" ).slideUp();
	      document.getElementById('hide_instructions').innerHTML = "show";
	    }
	  });
	};
	
	View.prototype.run = function() {
	  const simulation = new Simulation(this.context, this.width, this.height);
	  simulation.run();
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Needle = __webpack_require__(3);
	
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
	      self.max = document.getElementById('max').value;
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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map