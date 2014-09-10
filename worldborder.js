// ==UserScript==
// @name        Spade World Boundary
// @description This adds a world boundary overlay to the Overviewer map of the Spade server.
// @namespace   http://ermarian.net/resources/minecraft/spade/
// @include     http://te.calref.net/~minecraft/spade/*
// @version     1.01
// @grant       none
// ==/UserScript==
circle = function (point, r, tileSet, opts, vertices) {
  opts.paths = [];
  for (var i = 0; i <= vertices; i++) {
    var angle = i / vertices * 2 * Math.PI;
    var p = overviewer.util.fromWorldToLatLng(point[0] + r * Math.cos(angle), point[1], point[2] + r * Math.sin(angle), tileSet);
    opts.paths.push(p);
  }
  return new google.maps.Polygon(opts);
}
overviewer.views.WorldBoundaryView = Backbone.View.extend({
  render: function () {
    if (overviewer.collections.spawnMarker) {
      var curTileSet = overviewer.mapView.options.currentTileSet;
      var spawn = curTileSet.get('spawn');
      var c = circle(spawn, 2000, curTileSet, {
        'map': overviewer.map,
        strokeColor: '#FF0000',
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: '#00FF00',
        fillOpacity: 0.25
      }, 100);
    }
  }
});
overviewer.util.ready(function () {
  var boundary = new overviewer.views.WorldBoundaryView();
  boundary.render();
});
