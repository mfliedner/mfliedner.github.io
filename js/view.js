const Simulation = require('./simulation');

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

module.exports = View;
