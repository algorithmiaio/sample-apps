// http://stackoverflow.com/questions/24218783/javascript-canvas-pixel-manipulation

// Provides a new canvas containing [img] where
// all pixels having a hue less than [tolerance] 
// distant from [tgtHue] will be replaced by [newHue]
function shiftHue(img, tgtHue, newHue, tolerance) {
    // normalize inputs
    var normalizedTargetHue = tgtHue / 360;
    var normalizedNewHue = newHue / 360;
    var normalizedTolerance = tolerance / 360;
    // create output canvas
    var cv2 = document.createElement('canvas');
    cv2.width = img.width;
    cv2.height = img.height;
    var ctx2 = cv2.getContext('2d');
    ctx2.drawImage(img, 0, 0);
    // get canvad img data 
    var imgData = ctx2.getImageData(0, 0, img.width, img.height);
    var data = imgData.data;
    var lastIndex = img.width * img.height * 4;
    var rgb = [0, 0, 0];
    var hsv = [0.0, 0.0, 0.0];
    // loop on all pixels
    for (var i = 0; i < lastIndex; i += 4) {
        // retrieve r,g,b (! ignoring alpha !) 
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];
        // convert to hsv
        RGB2HSV(r, g, b, hsv);
        // change color if hue near enough from tgtHue
        var hueDelta = hsv[0] - normalizedTargetHue;
        if (Math.abs(hueDelta) < normalizedTolerance) {
            // adjust hue
            // ??? or do not add the delta ???
            hsv[0] = normalizedNewHue  //+ hueDelta;
            // convert back to rgb
            hsvToRgb(rgb, hsv);
            // store
            data[i] = rgb[0];
            data[i + 1] = rgb[1];
            data[i + 2] = rgb[2];
        }
    }
    ctx2.putImageData(imgData, 0, 0);
    return cv2;
}
