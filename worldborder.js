// ==UserScript==
// @name        Spade World Boundary
// @description This adds a world boundary overlay to the Overviewer map of the Spade server.
// @namespace   http://ermarian.net/resources/minecraft/spade/
// @include     http://te.calref.net/~minecraft/spade/*
// @version     2.01
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

/* Copied from overviewer.views.OverlayControlView.addItem.
 * The view and its DOM element are not exposed, so we need
 * to find the element and apply this static function to it.
 */
overlayControlAddItem = function(control, item) {
  var itemDiv = document.createElement('div');
  var itemInput = document.createElement('input');
  itemInput.type='checkbox';

  itemInput.checked =false;

  // give it a name
  $(itemInput).attr("_mc_overlayname", item.name);
  jQuery(itemInput).click((function(local_item) {
    return function(e) {
      item.action(local_item, e.target.checked);
    };
  })(item));

  $(".dropDown", control)[0].appendChild(itemDiv);
  itemDiv.appendChild(itemInput);
  var textNode = document.createElement('text');
  textNode.innerHTML = item.label + '<br/>';

  itemDiv.appendChild(textNode);
}

overviewer.views.WorldBoundaryView = Backbone.View.extend({
  render: function () {
    if (overviewer.collections.spawnMarker) {
      var curTileSet = overviewer.mapView.options.currentTileSet;
      var spawn = curTileSet.get('spawn');
      var c = circle(spawn, 2500, curTileSet, {
        strokeColor: '#FF0000',
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: '#00FF00',
        fillOpacity: 0.25
      }, 100);
      return c;
    }
  }
});

overviewer.util.ready(function () {
  var boundary = new overviewer.views.WorldBoundaryView();
  var circle = boundary.render();

  // Find the overlay menu:
  var overlayControl = overviewer.map.controls[google.maps.ControlPosition.TOP_RIGHT].j[2];

  overlayControlAddItem(
    overlayControl, {
      label: "World Boundary",
      name:"boundary",
      action: function(item, checked) {
        circle.setMap(checked ? overviewer.map : null);
      }
  });
});
