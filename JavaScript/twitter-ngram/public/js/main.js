(function() {
  var app, genCard;

  app = angular.module("algorithmia", []);

  app.controller("twitterNgramControl", function($scope, $http) {
    $scope.tname = "algorithmia";
    $scope.gen = function() {
      genCard($scope.tname, function(result) {
        $scope.$apply(function() {
          $scope.vcard = result;
        });
      });
    };
  });

  genCard = function(tname, cb) {
    var algoUrl;
    $("#demo-status").text("");
    algoUrl = "/ngram/TweetNgram";
    // this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
    Algorithmia.query(algoUrl, 'sim6rDAm0Oixeb88UmIOzxCL1ZZ1', [tname, 2, "data://demo/tweets/"], function(error, result) {
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

//# sourceMappingURL=twitterNgram.js.map
