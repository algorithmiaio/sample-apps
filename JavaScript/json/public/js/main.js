(function() {
  var app;

  app = angular.module("algorithmia");

  app.controller("JsonControl", function($scope) {
    $scope.inputJson = '[{"a": 1}, {}]';
    $scope.transformer = 'input[0]';
    $scope.json2html = function(jsonString) {
      var json, prettyJson;
      try {
        json = JSON.parse(jsonString);
        prettyJson = JSON.stringify(json, null, 2);
        return '<span>' + prettyJson + '</span>';
      } catch (_error) {
        return '<span class="text-danger">' + jsonString + '</span>';
      }
    };
    $scope.transform = function(inputJson, transformer) {
      "use strict";
      var input;
      if (transformer) {
        try {
          input = JSON.parse(inputJson);
          try {
            return (function() {
              var transformed;
              transformed = eval(transformer);
              return JSON.stringify(transformed);
            })();
          } catch (_error) {
            return "Invalid transform";
          }
        } catch (_error) {
          return "Invalid input JSON";
        }
      } else {
        return input;
      }
    };
    $scope.autoType = function(jsonString) {
      var json, jsonType;
      if (jsonString) {
        try {
          json = JSON.parse(jsonString);
          jsonType = Types.autoType(json);
          return Types.printType(jsonType);
        } catch (_error) {
          return "Invalid JSON";
        }
      } else {
        return "";
      }
    };
  });

}).call(this);

//# sourceMappingURL=json.js.map
