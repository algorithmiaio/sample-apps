// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');
var algorithmBuildingPermits = 'ETL/GetBuildingPermitData/0.1.5';

/**
 * once DOM is ready, update vars
 */
$(document).ready(function() {
  setInviteCode('timeseries');
});


/**
 * TBD: decide whether to stay on Angular1 or port to jQuery for simplicity
 */
(function() {
  var app, cities, copy, defaultOptions, defaultSeries, transpose, updateViz;

  app = angular.module("algorithmia");

  defaultOptions = {
    width: $("#tsControl").width(),
    height: 360,
    chartArea: {
      width: "80%"
    },
    legend: {
      alignment: "end",
      position: 'top'
    },
    animation: {
      duration: 500,
      easing: 'inAndOut',
      startup: true
    },
    vAxes: {
      0: {
        title: "Permits"
      }
    },
    series: {
      0: {
        color: "#f66",
        pointSize: 1
      },
      1: {
        color: "#f90",
        pointSize: 4
      },
      2: {
        color: "#5000be",
        pointSize: 4
      }
    }
  };

  copy = function(src) {
    return JSON.parse(JSON.stringify(src));
  };

  defaultSeries = [[], [], [], []];

  cities = {
    LasVegas: {
      "url": "data://etl/socrata/Building_Permits_LasVegas.csv",
      "colName": "PROJECT_ISSDTTM",
      "dateFormat": "%d/%m/%Y %I:%M:%S %p",
      "threshold": 10
    },
    SantaRosa: {
      "url": "data://etl/socrata/Building_Permits__ALL_SantaRosa.csv",
      "colName": "Issued Date",
      "dateFormat": "%m/%d/%Y %I:%M:%S %p",
      "threshold": 10
    },
    FortWorth: {
      "url": "data://etl/socrata/Development_Permits_FtWorth.csv",
      "colName": "Filing Date",
      "dateFormat": "%m/%d/%Y",
      "threshold": 10
    },
    NewYorkCity: {
      "url": "data://etl/socrata/DOB_Permit_Issuance_NYC.csv",
      "colName": "Issuance Date",
      "dateFormat": "%m/%d/%Y %I:%M:%S %p",
      "threshold": 12000
    },
    Boston: {
      "url": "data://etl/socrata/Approved_Building_Permits_Boston.csv",
      "colName": "ISSUED_DATE",
      "dateFormat": "%m/%d/%Y %I:%M:%S %p",
      "threshold": 10
    },
    LosAngeles: {
      "url": "data://etl/socrata/Building_and_Safety_Permit_Information_LA.csv",
      "colName": "Issue Date",
      "dateFormat": "%m/%d/%Y",
      "threshold": 10
    },
    Edmondton: {
      "url": "data://etl/socrata/Edmonton.csv",
      "colName": "Issue Date",
      "dateFormat": "%m/%d/%Y",
      "threshold": 10
    }
  };

  app.controller("TimeSeriesControl", function($scope, $http) {
    var algoClient;
    $scope.headers = ['Time', 'Value'];
    $scope.tsOptions = defaultOptions;
    $scope.tsData = defaultSeries;
    $scope.dataSource = "Edmonton";
    $scope.dataFilter1 = "/util/Echo";
    $scope.dataFilter2 = "/util/Echo";
    $scope.dataAnalysis = "/timeseries/Forecast";
    algoClient = Algorithmia.client(Algorithmia.demo.demo_api_key, "https://api.algorithmia.com/v1/web/algo");
    $scope.analyze = function() {
      if (!$scope.dataSource) {
        return;
      }
      console.log("Fetching data...", $scope.dataSource);
      algoClient.algo(algorithmBuildingPermits).pipe($scope.dataSource).then(function(result1) {
        var timeseries, timestamps;
        if (!result1.error) {
          timestamps = result1.result[0].map(function(ts) {
            return new Date(ts.replace(" ", "T"));
          });
          timeseries = result1.result[1];
          updateViz(timestamps, timeseries, [], []);
          console.log("Filtering1...", $scope.dataFilter1);
          return algoClient.algo($scope.dataFilter1).pipe(timeseries).then(function(result2) {
            var timeseriesFiltered1;
            if (!result2.error) {
              timeseriesFiltered1 = result2.result;
              updateViz(timestamps, timeseries, timeseriesFiltered1, []);
              console.log("Filtering2...", $scope.dataFilter2);
              return algoClient.algo($scope.dataFilter2).pipe(timeseriesFiltered1).then(function(result3) {
                var timeseriesFiltered2;
                if (!result3.error) {
                  timeseriesFiltered2 = result3.result;
                  updateViz(timestamps, timeseries, timeseriesFiltered2, []);
                  console.log("Analyzing...", $scope.dataAnalysis);
                  return algoClient.algo($scope.dataAnalysis).pipe(timeseriesFiltered2).then(function(result4) {
                    var dataSize, forecastSize, i, lastDate, timeseriesAnalysis, _i, _ref;
                    if (!result4.error) {
                      timeseriesAnalysis = result4.result;
                      if ($scope.dataAnalysis === "/timeseries/Forecast") {
                        dataSize = timestamps.length;
                        forecastSize = timeseriesAnalysis.length;
                        timeseriesAnalysis = [];
                        lastDate = timestamps[timestamps.length - 1];
                        for (i = _i = 0, _ref = dataSize + forecastSize - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                          if (i < dataSize) {
                            timeseriesAnalysis[i] = null;
                          } else {
                            timeseriesAnalysis[i] = result4.result[i - dataSize];
                            timestamps[i] = new Date(lastDate);
                            timestamps[i].setMonth(lastDate.getMonth() + i - dataSize + 1);
                          }
                        }
                      }
                      $scope.$apply(function() {
                        if ($scope.dataAnalysis === "/timeseries/AutoCorrelate") {
                          $scope.tsOptions = copy(defaultOptions);
                          $scope.tsOptions.series[2].targetAxisIndex = 1;
                          return $scope.tsOptions.vAxes[1] = {
                            textPosition: 'none'
                          };
                        } else {
                          return $scope.tsOptions = defaultOptions;
                        }
                      });
                      updateViz(timestamps, timeseries, timeseriesFiltered2, timeseriesAnalysis);
                      return console.log("Analysis", timeseriesAnalysis);
                    } else {
                      console.error("Failed to analyze data", result4.error);
                      return $scope.errorMessage = "Failed to analyze data";
                    }
                  });
                } else {
                  console.error("Failed to filter2 data", result3.error);
                  return $scope.errorMessage = "Failed to filter2 data";
                }
              });
            } else {
              console.error("Failed to filter1 data", result2.error);
              return $scope.errorMessage = "Failed to filter1 data";
            }
          });
        } else {
          console.error("Failed to load data", result1.error);
          return $scope.errorMessage = "Failed to load data";
        }
      });
    };
  });

  app.directive("timeseriesChart", function() {
    return {
      restrict: 'E',
      scope: {
        headers: '=',
        data: '=',
        options: '='
      },
      link: function(lscope, element, attrs, controller) {
        var chart, redraw;
        chart = new google.visualization.ScatterChart(element[0]);
        redraw = function(scope, element) {
          var chartdata, headerWrapper, tsData;
          if (scope.headers && scope.data && scope.data.length > 0) {
            headerWrapper = [scope.headers];
            tsData = (function() {
              if (typeof scope.data === "string") {
                try {
                  return JSON.parse(scope.data);
                } catch (_error) {
                  return defaultSeries;
                }
              } else {
                return scope.data;
              }
            })();
            tsData = transpose(tsData);
            chartdata = new google.visualization.DataTable();
            chartdata.addColumn("date", "Date");
            chartdata.addColumn("number", "Raw");
            chartdata.addColumn("number", "Filtered");
            chartdata.addColumn("number", "Analysis");
            chartdata.addRows(tsData);
            chart.draw(chartdata, scope.options);
          }
        };
        lscope.$watch('data', (function(newValue) {
          return redraw(lscope, element);
        }), true);
        lscope.$watch('headers', (function(newValue) {
          return redraw(lscope, element);
        }), true);
        lscope.$watch('options', (function(newValue) {
          return redraw(lscope, element);
        }), true);
      },
      template: '<div></div>'
    };
  });

  transpose = function(arr) {
    return Object.keys(arr[0]).map(function(col) {
      return arr.map(function(row) {
        return row[col];
      });
    });
  };

  updateViz = function(labels, raw, filtered, analysis) {
    var data, tsScope;
    if (typeof data === !"string") {
      data = JSON.stringify(data);
    }
    tsScope = angular.element("#tsControl").scope();
    tsScope.$apply(function() {
      return tsScope.tsData = [labels, raw, filtered, analysis];
    });
  };

}).call(this);