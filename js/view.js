const Simulation = require('./simulation');

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
