module.exports = function clampedBound (bound, maxWidth, maxHeight) {
  var w = bound[2], h = bound[3];
  var ratio = w / h;
  if (w > maxWidth) {
    w = maxWidth;
    h = ~~(w / ratio);
  }
  if (h > maxHeight) {
    h = maxHeight;
    w = ~~(h * ratio);
  }
  return [
    Math.max(0, Math.min(bound[0], maxWidth-w)),
    Math.max(0, Math.min(bound[1], maxHeight-h)),
    w,
    h
  ];
};
