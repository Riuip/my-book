/* Original contour study. Shared by the static build and the interactive cover. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WYQ_ORBIT = factory();
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  var names = ['环流', '回声', '潮汐'];
  function paths(mode) {
    mode = ((mode || 0) % 3 + 3) % 3;
    var lines = [];
    for (var j = 0; j < 40; j++) {
      var v = j / 40 * Math.PI * 2;
      var d = '';
      for (var i = 0; i <= 100; i++) {
        var u = i / 100 * Math.PI * 2;
        var tube = 49 + (mode === 2 ? 13 * Math.sin(u * 3) : 0);
        var major = mode === 1 ? 121 : 140;
        var x = (major + tube * Math.cos(v)) * Math.cos(u);
        var y = (major + tube * Math.cos(v)) * Math.sin(u);
        var z = tube * Math.sin(v) + (mode === 1 ? 48 * Math.sin(u * 2) : 17 * Math.cos(u * 2));
        var ry = .55 + mode * .18, rx = .92 - mode * .13;
        var xx = x * Math.cos(ry) + z * Math.sin(ry);
        var zz = -x * Math.sin(ry) + z * Math.cos(ry);
        var yy = y * Math.cos(rx) - zz * Math.sin(rx);
        var depth = y * Math.sin(rx) + zz * Math.cos(rx);
        var zoom = 1.09 * 900 / (900 + depth);
        var twist = -.32;
        var px = 260 + (xx * Math.cos(twist) - yy * Math.sin(twist)) * zoom;
        var py = 260 + (xx * Math.sin(twist) + yy * Math.cos(twist)) * zoom;
        d += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1);
      }
      lines.push({ d:d + 'Z', opacity:(.32 + .42 * (Math.sin(v) + 1) / 2).toFixed(2) });
    }
    return lines;
  }
  return { names:names, paths:paths };
});
