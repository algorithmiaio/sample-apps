(function() {
  var addClick, canvas, classify, clickDrag, clickX, clickY, client, context, dragging, drawPath, erase, getBoundingBox, mahoutClassify, miniCanvas, miniContext, paint, redraw, strokeWidth, toGreyscale, wekaClassify;

  canvas = null;

  context = null;

  miniCanvas = null;

  miniContext = null;

  strokeWidth = 16;

  dragging = false;

  paint = false;

  clickX = [];

  clickY = [];

  clickDrag = [];

  // this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
  client = Algorithmia.client('simYGhuyUpyFFAIRynUx1CKzWdI1');

  window.addEventListener("load", function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    miniCanvas = document.getElementById("miniCanvas");
    miniContext = miniCanvas.getContext("2d");
    canvas.addEventListener("mousemove", function(e) {
      if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        return redraw();
      }
    });
    canvas.addEventListener("mousedown", function(e) {
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false);
      return redraw();
    });
    canvas.addEventListener("mouseup", function(e) {
      return paint = false;
    });
    canvas.addEventListener("mouseout", function(e) {
      return paint = false;
    });
    canvas.addEventListener("touchstart", function(e) {
      var touch, _i, _len, _ref;
      e.preventDefault();
      paint = true;
      _ref = e.changedTouches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        addClick(touch.pageX - this.offsetLeft, touch.pageY - this.offsetTop, false);
      }
      return redraw();
    });
    canvas.addEventListener("touchmove", function(e) {
      var touch, _i, _len, _ref;
      if (paint) {
        _ref = e.changedTouches;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          touch = _ref[_i];
          addClick(touch.pageX - this.offsetLeft, touch.pageY - this.offsetTop, true);
        }
        return redraw();
      }
    });
    return canvas.addEventListener("touchend", function(e) {
      return paint = false;
    });
  });

  redraw = (function(_this) {
    return function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "black";
      context.lineWidth = strokeWidth;
      context.lineJoin = "round";
      return drawPath();
    };
  })(this);

  addClick = function(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    return clickDrag.push(dragging);
  };

  drawPath = function() {
    var i, _i, _ref, _results;
    _results = [];
    for (i = _i = 0, _ref = clickX.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      context.beginPath();
      if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1]);
      } else {
        context.moveTo(clickX[i] - 1, clickY[i]);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      _results.push(context.stroke());
    }
    return _results;
  };

  classify = function() {
    var bbox, greys, leftShift, maxSize, topShift;
    redraw();
    bbox = getBoundingBox(context);
    console.log("bbox", bbox);
    maxSize = Math.max(bbox.right - bbox.left, bbox.bottom - bbox.top);
    topShift = bbox.cy - (maxSize / 2);
    leftShift = bbox.cx - (maxSize / 2);
    miniContext.drawImage(canvas, leftShift, topShift, maxSize, maxSize, 4, 4, 20, 20);
    context.strokeStyle = "red";
    context.lineWidth = 1;
    context.rect(bbox.left, bbox.top, bbox.right - bbox.left, bbox.bottom - bbox.top);
    context.rect(bbox.cx, bbox.cy, 1, 1);
    context.stroke();
    greys = toGreyscale(miniContext);
    console.log("bitmap", JSON.stringify(greys));
    mahoutClassify(greys);
    return wekaClassify(greys);
  };

  mahoutClassify = function(greys) {
    document.getElementById("mahout-out").innerHTML = "";
    return client.algo("/mahout/DigitRecognizer").pipe(greys).then(function(result) {
      if (result.error) {
        document.getElementById("mahout-out").innerHTML = '<span class="text-danger">' + (result.error.message || result.error) + '</span>';
        return;
      }
      document.getElementById("mahout-out").innerHTML = JSON.stringify(result.result, null, 2);
      if (result.result === null) {
        document.getElementById("mahout-out").innerHTML = "No match found";
      }
    });
  };

  wekaClassify = function(greys) {
    document.getElementById("weka-out").innerHTML = "";
    return client.algo("/weka/DigitRecognition").pipe(greys).then(function(result) {
      var k, top_k, top_v, v, _ref;
      if (result.error) {
        document.getElementById("weka-out").innerHTML = '<span class="text-danger">' + (result.error.message || result.error) + '</span>';
        return;
      }
      top_v = -1;
      top_k = null;
      _ref = result.result;
      for (k in _ref) {
        v = _ref[k];
        if (v > top_v) {
          top_k = k;
          top_v = v;
        }
      }
      document.getElementById("weka-out").innerHTML = top_k;
      if (result === null) {
        document.getElementById("weka-out").innerHTML = "No match found";
      }
    });
  };

  erase = function() {
    document.getElementById("mahout-out").innerHTML = "";
    document.getElementById("weka-out").innerHTML = "";
    context.clearRect(0, 0, canvas.width, canvas.height);
    miniContext.clearRect(0, 0, miniCanvas.width, miniCanvas.height);
    clickX = [];
    clickY = [];
    return clickDrag = [];
  };

  toGreyscale = function(context) {
    var alpha, black, col, greys, height, imgData, index, row, width;
    width = context.canvas.width;
    height = context.canvas.height;
    imgData = context.getImageData(0, 0, width, height).data;
    greys = (function() {
      var _i, _ref, _results;
      _results = [];
      for (row = _i = 0, _ref = height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; row = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (col = _j = 0, _ref1 = width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; col = 0 <= _ref1 ? ++_j : --_j) {
            index = (row * width + col) * 4;
            black = 255 - Math.floor(0.2126 * imgData[index] + 0.7152 * imgData[index + 1] + 0.0722 * imgData[index + 2]);
            alpha = imgData[index + 3];
            _results1.push(alpha && black);
          }
          return _results1;
        })());
      }
      return _results;
    })();
    return greys;
  };

  getBoundingBox = function(context) {
    var bounds, cx, cy, greys, height, total, value, width, x, y, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
    width = context.canvas.width;
    height = context.canvas.height;
    greys = toGreyscale(context);
    bounds = {};
    cx = 0;
    cy = 0;
    total = 0;
    for (y = _i = 0, _ref = height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      for (x = _j = 0, _ref1 = width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        value = greys[y][x];
        if (value && bounds.top === void 0) {
          bounds.top = y;
        }
        if (value) {
          bounds.bottom = y;
        }
        cx += x * value;
        cy += y * value;
        total += value;
      }
    }
    for (x = _k = 0, _ref2 = width - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; x = 0 <= _ref2 ? ++_k : --_k) {
      for (y = _l = 0, _ref3 = height - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; y = 0 <= _ref3 ? ++_l : --_l) {
        if (greys[y][x] && bounds.left === void 0) {
          bounds.left = x;
        }
        if (greys[y][x]) {
          bounds.right = x;
        }
      }
    }
    bounds.cx = cx / total;
    bounds.cy = cy / total;
    return bounds;
  };

  window.classify = classify;

  window.erase = erase;

}).call(this);

//# sourceMappingURL=handwriting.js.map
