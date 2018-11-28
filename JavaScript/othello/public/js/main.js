(function() {
  var app;

  app = angular.module("algorithmia");

  app.controller("OthelloControl", function($scope, $http) {
    var client, findOpposition, flipPieces, hasLegalMove, isLegalMove, otherPlayer, radiate, waitingForHuman;
    // this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
    client = Algorithmia.client("simAvuOVN6OJDfvZOnarXOx8M0J1");
    $scope.player1 = "human";
    $scope.player2 = "ai";
    waitingForHuman = false;
    $scope.newGame = function() {
      document.getElementById("demo-status").innerHTML = "";
      $scope.player = 1;
      $scope.board = [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 2, 0, 0, 0], [0, 0, 0, 2, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]];
      $scope.count = [60, 2, 2];
      return $scope.go();
    };
    $scope.go = function() {
      if ($scope.player === 0) {
        toastr.success("Game Over! " + $scope.winnerName() + " wins!");
      }
      if (($scope.player === 1 && $scope.player1 === "ai") || ($scope.player === 2 && $scope.player2 === "ai")) {
        waitingForHuman = false;
        document.getElementById("othello-in").innerHTML = "<pre>" + JSON.stringify([$scope.board, $scope.player], null, 2) + "</pre>";
        document.getElementById("othello-out").innerHTML = "";
        document.getElementById("demo-status").innerHTML = "";
        client.algo("algo://kenny/Othello").pipe([$scope.board, $scope.player]).then(function(result) {
          var move;
          if (result.error) {
            document.getElementById("othello-out").innerHTML = '<span class="text-danger">' + (result.error.message || result.error) + '</span>';
            document.getElementById("demo-status").innerHTML = '<span class="text-danger">' + (result.error.message || result.error) + '</span>';
            return toastr.error((result.error.message || result.error).toString());
          } else {
            move = result.result;
            document.getElementById("othello-out").innerHTML = '<span>' + JSON.stringify(move, null, 2) + '</span>';
            return $scope.makeMove(move[0], move[1], true);
          }
        });
      } else {
        waitingForHuman = true;
      }
    };
    $scope.makeMove = function(row, col, iamAI) {
      var flips, phase, playerType;
      if ($scope.board[row][col] || !waitingForHuman && !iamAI) {
        return;
      }
      flips = radiate(row, col, flipPieces);
      if (flips) {
        playerType = ["", $scope.player1, $scope.player2][$scope.player];
        console.log("Player " + $scope.player + " (" + playerType + ") " + " making move ", [row, col]);
        $scope.board[row][col] = $scope.player;
        $scope.count[0]--;
        $scope.count[$scope.player] += flips + 1;
        $scope.count[otherPlayer()] -= flips;
        $scope.player = otherPlayer();
        if (!hasLegalMove()) {
          $scope.player = otherPlayer();
        }
        if (!hasLegalMove()) {
          $scope.player = 0;
        }
        phase = $scope.$root.$$phase;
        if (phase !== '$apply' && phase !== '$digest') {
          $scope.$apply();
        }
        $scope.go();
      }
    };
    $scope.playerName = function() {
      return ["", "Black", "White"][$scope.player];
    };
    $scope.winnerName = function() {
      if ($scope.count[1] < $scope.count[2]) {
        return "White";
      } else if ($scope.count[1] > $scope.count[2]) {
        return "Black";
      } else {
        return "Tie";
      }
    };
    $scope.pieceImg = function(player) {
      return "public/images/circle" + player + ".png";
    };
    otherPlayer = function() {
      return ($scope.player % 2) + 1;
    };
    findOpposition = function(row, col, dx, dy) {
      var i, _i;
      for (i = _i = 1; _i <= 8; i = ++_i) {
        if (row + i * dx < 0 || 8 <= row + i * dx || col + i * dy < 0 || 8 <= col + i * dy) {
          return 0;
        }
        switch ($scope.board[row + i * dx][col + i * dy]) {
          case 0:
            return 0;
          case $scope.player:
            return i - 1;
        }
      }
    };
    flipPieces = function(row, col, dx, dy) {
      var dist, i, _i;
      dist = findOpposition(row, col, dx, dy);
      for (i = _i = 1; _i <= dist; i = _i += 1) {
        $scope.board[row + i * dx][col + i * dy] = $scope.player;
      }
      return dist;
    };
    radiate = function(row, col, fn) {
      var dx, dy, total, _i, _j;
      total = 0;
      for (dx = _i = -1; _i <= 1; dx = ++_i) {
        for (dy = _j = -1; _j <= 1; dy = ++_j) {
          if (dx || dy) {
            total += fn(row, col, dx, dy);
          }
        }
      }
      return total;
    };
    isLegalMove = function(row, col) {
      return !$scope.board[row][col] && radiate(row, col, findOpposition);
    };
    return hasLegalMove = function() {
      var col, row, _i, _j;
      for (row = _i = 0; _i <= 7; row = ++_i) {
        for (col = _j = 0; _j <= 7; col = ++_j) {
          if (isLegalMove(row, col)) {
            return true;
          }
        }
      }
      return false;
    };
  });

}).call(this);

//# sourceMappingURL=othello.js.map
