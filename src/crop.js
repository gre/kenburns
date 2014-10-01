/**
 * Compute an absolute CropBound from relative parameters:
 * - zoom: a value in range ]0,1] which describe the crop zoom ratio. 1 is the full image size.
 * - center: a [w,h] array where w and h are value in range [0,1] describing the desired center of the crop bound.
 *
 * second parameters:
 * - canvas: a canvas (or an object with width and height)
 * - image: a loaded image (or an object with width and height).
 *
 * The crop also will ensure:
 * - that image ratio is preserved
 * - the crop area is bounded: the canvas won't display out of bound parts of the image.
 *
 * Returns:
 * a CropBound, an [x, y, width, height] array describing the area to crop in pixels.
 */
function crop (zoom, center) {
  if (!center) center = [0.5, 0.5];
  return function (canvas, image) {
    var canvasRatio = canvas.width / canvas.height;
    var imageRatio = image.width / image.height;

    var maxRatio = Math.max(canvasRatio, imageRatio);
    var zoomedCanvasSize = [
      (canvasRatio / maxRatio) * image.width * zoom,
      (imageRatio / maxRatio) * image.height * zoom
    ];

    return [
      Math.round(image.width * center[0] - zoomedCanvasSize[0] / 2),
      Math.round(image.height * center[1] - zoomedCanvasSize[1] / 2),
      Math.round(zoomedCanvasSize[0]),
      Math.round(zoomedCanvasSize[1])
    ];
  };
}

crop.largest = crop(1);

module.exports = crop;
