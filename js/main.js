const View = require('./view');

$(document).ready(function() {
  const root = $('.buffon');
  const buffon_view = new View(root);
  buffon_view.init();
});
