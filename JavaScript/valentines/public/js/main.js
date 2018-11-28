(function() {
  var app, genCard;

  app = angular.module("algorithmia", []);

  app.controller("VDayControl", function($scope, $http) {
    $scope.vname = "Mia";
    $scope.gen = function() {
      genCard($scope.vname, function(result) {
        $scope.$apply(function() {
          $scope.vcard = result;
        });
      });
    };
  });

  genCard = function(vname, cb) {
    var algoUrl;
    $("#demo-status").text("");
    algoUrl = "/ngram/GenerateRandomLoveLetter";
    // this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
    Algorithmia.query(algoUrl, 'simdnTvppMeyb32EBog5BTiguIe1', [vname, "algorithmia"], function(error, result) {
      if (error) {
        $("#demo-status").html('<span class="text-danger">' + error + '</span>');
        return;
      }
      $("#demo-status").text("");
      if (cb) {
        cb(result);
      }
    });
  };

}).call(this);

//# sourceMappingURL=vday.js.map