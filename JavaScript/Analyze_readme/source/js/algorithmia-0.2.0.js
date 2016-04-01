(function() {
  var Algorithm, Client, Promise, algoPattern, getDefaultApiAddress;

  window.Algorithmia = window.Algorithmia || {};

  if (Algorithmia.query) {
    console.error("Warning: algorithmia.js loaded twice");
  }

  if (Algorithmia.client) {
    console.error("Warning: algorithmia.js loaded twice");
  }

  if (Algorithmia.apiAddress) {
    console.log("Using alternate API server: " + Algorithmia.apiAddress);
  }

  getDefaultApiAddress = function() {
    if (Algorithmia.apiAddress !== void 0) {
      return Algorithmia.apiAddress;
    } else {
      return "https://api.algorithmia.com/v1/web/algo";
    }
  };

  algoPattern = /^(?:algo:\/\/|\/|)(\w+\/.+)$/;

  Algorithmia.query = function(algo_uri, api_key, input, cb) {
    return Algorithmia.client(api_key).algo(algo_uri).pipe(input, function(result) {
      if (result.error) {
        return cb(result.error.message || result.error);
      } else {
        return cb(void 0, result.result);
      }
    });
  };

  Algorithmia.client = function(api_key, api_address) {
    api_key = api_key || Algorithmia.apiKey;
    api_address = api_address || getDefaultApiAddress();
    return new Client(api_key, api_address);
  };

  Client = function(api_key, api_address) {
    this.api_key = api_key;
    this.api_address = api_address;
    this.algo = function(algo_uri) {
      if (algo_uri && typeof algo_uri === "string") {
        return new Algorithm(this, algo_uri);
      } else {
        console.error("Invalid algorithm url: " + algo_uri);
        return null;
      }
    };
  };

  Algorithmia.algo = function(algo_uri) {
    return Algorithmia.client().algo(algo_uri);
  };

  Algorithm = function(client, algo_uri) {
    if (!(typeof algo_uri === "string" && algo_uri.match(algoPattern))) {
      throw "Invalid Algorithm URI (expected /owner/algo)";
    }
    this.client = client;
    this.algo_uri = algo_uri.match(algoPattern)[1];
    this.pipe = function(input, cb) {
      var promise;
      Algorithmia.startTask();
      promise = new Promise((function(_this) {
        return function(resolve) {
          var endpoint_url, xhr;
          xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            var error, responseJson;
            if (xhr.readyState === 4) {
              Algorithmia.finishTask();
              if (xhr.status === 0) {
                if (xhr.responseText) {
                  resolve({
                    error: "API connection error: " + xhr.responseText
                  });
                } else {
                  resolve({
                    error: "API connection error"
                  });
                }
              } else if (xhr.status === 502) {
                resolve({
                  error: "API error, bad gateway"
                });
              } else if (xhr.status === 503) {
                resolve({
                  error: "API error, service unavailable"
                });
              } else if (xhr.status === 504) {
                resolve({
                  error: "API error, server timeout"
                });
              } else {
                try {
                  responseJson = JSON.parse(xhr.responseText);
                  resolve(responseJson);
                } catch (_error) {
                  error = _error;
                  resolve({
                    error: "API error (status " + xhr.status + "): " + error
                  });
                }
              }
            }
          };
          endpoint_url = client.api_address + "/" + _this.algo_uri;
          xhr.open("POST", endpoint_url, true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("Accept", "application/json, text/javascript");
          if (client.api_key) {
            xhr.setRequestHeader("Authorization", "Simple " + client.api_key);
          }
          return xhr.send(JSON.stringify(input));
        };
      })(this));
      if (cb) {
        promise.then(cb);
      }
      return promise;
    };
  };

  Promise = function(runner) {
    var resolve;
    this.isComplete = false;
    this.listeners = [];
    this.result = void 0;
    resolve = (function(_this) {
      return function(result) {
        var cb, _i, _len, _ref;
        _this.result = result;
        _this.isComplete = true;
        _ref = _this.listeners;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cb = _ref[_i];
          try {
            cb(result);
          } catch (_error) {}
        }
      };
    })(this);
    this.then = (function(_this) {
      return function(cb) {
        if (_this.isComplete) {
          try {
            return cb(_this.result);
          } catch (_error) {}
        } else {
          return _this.listeners.push(cb);
        }
      };
    })(this);
    runner(resolve);
  };

  Algorithmia.tasksInProgress = 0;

  Algorithmia.startTask = function() {
    var spinner, _i, _len, _ref;
    if (Algorithmia.tasksInProgress === 0) {
      _ref = document.getElementsByClassName("algo-spinner");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        spinner = _ref[_i];
        spinner.style.visibility = "visible";
      }
    }
    Algorithmia.tasksInProgress++;
  };

  Algorithmia.finishTask = function() {
    var spinner, _i, _len, _ref;
    Algorithmia.tasksInProgress--;
    if (Algorithmia.tasksInProgress === 0) {
      _ref = document.getElementsByClassName("algo-spinner");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        spinner = _ref[_i];
        spinner.style.visibility = "hidden";
      }
    } else if (Algorithmia.tasksInProgress < 0) {
      console.error("Algorithmia task error (unknown task finished)");
    }
  };

  if (Algorithmia.onload && typeof Algorithmia.onload === 'function') {
    Algorithmia.onload();
  }

}).call(this);

//# sourceMappingURL=algorithmia-0.2.0.js.map
