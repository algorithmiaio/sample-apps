(function() {
  var app;

  app = angular.module("algorithmia");

  app.controller("FlowControl", function($scope, $http) {
    var isArray, isExecutable, isValid, isValidAlgorithm, isValidInput, isValidOutput, planFlow, renderAlgorithm, renderInput, renderOutput, sampleFlow;
    $scope.algorithms = [];
    sampleFlow = [
      {
        "algorithm": "algo://web/GetLinks",
        "inputs": [
          {
            "type": "const",
            "value": "http://www.york.ac.uk/teaching/cws/wws/webpage1.html"
          }
        ],
        "output": {
          "type": "var",
          "value": "links"
        }
      }, {
        "algorithm": "algo://util/ParallelForEach",
        "inputs": [
          {
            "type": "const",
            "value": "algo://util/url2text"
          }, {
            "type": "var",
            "value": "links"
          }
        ],
        "output": {
          "type": "var",
          "value": "contents"
        }
      }, {
        "algorithm": "algo://util/ParallelForEach",
        "inputs": [
          {
            "type": "const",
            "value": "algo://nlp/LanguageIdentification"
          }, {
            "type": "var",
            "value": "contents"
          }
        ],
        "output": {
          "type": "var",
          "value": "languages"
        }
      }, {
        "algorithm": "algo://util/Write",
        "inputs": [
          {
            "type": "const",
            "value": "data://kenny/Temp/links.txt"
          }, {
            "type": "var",
            "value": "links"
          }
        ],
        "output": {
          "type": "void"
        }
      }, {
        "algorithm": "algo://util/Write",
        "inputs": [
          {
            "type": "const",
            "value": "data://kenny/Temp/languages.txt"
          }, {
            "type": "var",
            "value": "languages"
          }
        ],
        "output": {
          "type": "void"
        }
      }
    ];
    $scope.flow = JSON.stringify(sampleFlow, null, 2);
    $scope.executeFlow = function(flowJson) {
      var error, flow, onError, onSuccess, req;
      try {
        flow = JSON.parse(flowJson);
        req = $http.post("https://algorithmia.com/flow", flow);
        onSuccess = function() {
          return toastr.success("Flow submitted to Algorithmia for processing");
        };
        onError = function(response) {
          if (error) {
            return toastr.error("Error: " + (response.data.error || response.data));
          } else {
            return toastr.error("Error: failed to connect to Algorithmia API");
          }
        };
        return req.then(onSuccess, onError);
      } catch (_error) {
        error = _error;
        return toastr.error("Error: " + error);
      }
    };
    $scope.$watch((function(scope) {
      return scope.flow;
    }), function() {
      var algorithm, error, flow, layer, layerHtml, _i, _j, _k, _len, _len1, _len2, _ref, _results, _results1;
      try {
        $(".flow-view").empty();
        flow = JSON.parse($scope.flow);
        if (!isArray(flow)) {
          flow = [flow];
        }
        if (isValid(flow)) {
          _ref = planFlow(flow);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            layer = _ref[_i];
            layerHtml = "<div class=\"flow-layer\">";
            for (_j = 0, _len1 = layer.length; _j < _len1; _j++) {
              algorithm = layer[_j];
              layerHtml += renderAlgorithm(algorithm);
            }
            layerHtml += "</div>";
            _results.push($(".flow-view").append(layerHtml));
          }
          return _results;
        } else {
          _results1 = [];
          for (_k = 0, _len2 = flow.length; _k < _len2; _k++) {
            algorithm = flow[_k];
            _results1.push($(".flow-view").append(renderAlgorithm(algorithm)));
          }
          return _results1;
        }
      } catch (_error) {
        error = _error;
        return $(".flow-view").html("<div class=\"text-danger\">Error: " + error + "</div>");
      }
    });
    isValid = function(flow) {
      var algorithm, _i, _len;
      if (!flow) {
        return false;
      }
      if (!isArray(flow)) {
        flow = [flow];
      }
      for (_i = 0, _len = flow.length; _i < _len; _i++) {
        algorithm = flow[_i];
        if (!isValidAlgorithm(algorithm)) {
          return false;
        }
      }
      return true;
    };
    isValidAlgorithm = function(algorithm) {
      var input, _i, _len, _ref;
      if (!algorithm) {
        return false;
      }
      if (!algorithm.algorithm) {
        return false;
      }
      if (!algorithm.inputs) {
        return false;
      }
      if (!algorithm.output) {
        return false;
      }
      _ref = algorithm.inputs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        if (!isValidInput(input)) {
          return false;
        }
      }
      if (!isValidOutput(algorithm.output)) {
        return false;
      }
      return true;
    };
    isValidInput = function(input) {
      switch (input.type) {
        case "const":
        case "var":
        case "url":
        case "file":
          return !!input.value;
        default:
          return false;
      }
    };
    isValidOutput = function(output) {
      switch (output.type) {
        case "var":
        case "file":
          return !!output.value;
        case "void":
          return true;
        default:
          return false;
      }
    };
    renderAlgorithm = function(algorithm) {
      var error, inputs, output, valid;
      try {
        if (!algorithm.algorithm) {
          throw "missing algorithm field";
        }
        if (!algorithm.inputs) {
          throw "missing inputs field";
        }
        if (!algorithm.output) {
          throw "missing output field";
        }
        if (algorithm.inputs.length === 0) {
          inputs = "[]";
        } else {
          inputs = algorithm.inputs.map(renderInput).join();
        }
        output = renderOutput(algorithm.output);
        valid = isValidAlgorithm(algorithm) ? "" : "text-danger";
        return "<div class=\"flow-algorithm " + valid + "\">\n    <div>" + inputs + "</div>\n    <div>" + algorithm.algorithm + "</div>\n    <div>" + output + "</div>\n</div>";
      } catch (_error) {
        error = _error;
        return "<div class=\"flow-algorithm text-danger\">Error: " + error + "</div>";
      }
    };
    renderInput = function(input) {
      switch (input.type) {
        case "const":
          return JSON.stringify(input.value);
        case "var":
        case "url":
        case "file":
          if (!input.value) {
            throw "missing input value";
          }
          return "{{" + input.value + "}}";
        case void 0:
          throw "missing input type";
          break;
        default:
          throw "invalid input type: " + input.type;
      }
    };
    renderOutput = function(output) {
      switch (output.type) {
        case "var":
        case "file":
          if (!output.value) {
            throw "missing output value";
          }
          return "{{" + output.value + "}}";
        case "void":
          return "{{void}}";
        case void 0:
          throw "missing output type";
          break;
        default:
          throw "invalid output type: " + output.type;
      }
    };
    planFlow = function(flow) {
      var algo, boundVariables, count, done, executable, i, layers, _i, _j, _len, _len1;
      boundVariables = {};
      layers = [];
      done = [];
      count = 0;
      while (count < flow.length) {
        executable = [];
        for (i = _i = 0, _len = flow.length; _i < _len; i = ++_i) {
          algo = flow[i];
          if (!done[i] && isExecutable(algo, boundVariables)) {
            executable.push(algo);
            done[i] = true;
            count++;
          }
        }
        for (_j = 0, _len1 = executable.length; _j < _len1; _j++) {
          algo = executable[_j];
          if (!algo.output) {
            throw "missing output";
          }
          if (algo.output.type === "var") {
            if (boundVariables[algo.output.value]) {
              throw "duplicate output variable " + algo.output.value;
            }
            boundVariables[algo.output.value] = true;
          }
        }
        if (executable.length === 0) {
          throw "unable to schedule work due to unresolved input dependency";
        }
        layers.push(executable);
      }
      return layers;
    };
    isExecutable = function(algo, boundVariables) {
      var input, _i, _len, _ref;
      if (algo && isArray(algo.inputs)) {
        _ref = algo.inputs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          input = _ref[_i];
          if (input.type === "var" && !boundVariables[input.value]) {
            return false;
          }
        }
      }
      return true;
    };
    return isArray = function(arr) {
      return Object.prototype.toString.call(arr) === "[object Array]";
    };
  });

}).call(this);

//# sourceMappingURL=flow.js.map