const View = require('./view');

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
