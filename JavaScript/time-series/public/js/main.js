// init the Algorithmia client with your API key from https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simeyUbLXQ/R8Qga/3ZCRGcr2oR1');
var algorithmBuildingPermits = 'ETL/GetBuildingPermitData/0.1.5';

var chart, chartOptions;

/**
 * once DOM is ready, update vars
 */
$(document).ready(function() {
  setInviteCode('timeseries');
  chart = new google.visualization.ScatterChart($('#timeseries-chart')[0]);
  startAnalysis();
});

var defaultOptions = {
  width: $("#timeseries-controls").width(),
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

var startAnalysis = function() {
  $('#errorMessage').empty();
  chartOptions = defaultOptions;
  algoClient.algo(algorithmBuildingPermits).pipe($('#dataSource').val()).then(function(result1) {
    var timeseries, timestamps;
    if (!result1.error) {
      timestamps = result1.result[0].map(function(ts) {
        return new Date(ts.replace(" ", "T"));
      });
      timeseries = result1.result[1];
      updateViz(timestamps, timeseries, [], []);
      return algoClient.algo($('#dataFilter1').val()).pipe(timeseries).then(function(result2) {
        var timeseriesFiltered1;
        if (!result2.error) {
          timeseriesFiltered1 = result2.result;
          updateViz(timestamps, timeseries, timeseriesFiltered1, []);
          return algoClient.algo($('#dataFilter2').val()).pipe(timeseriesFiltered1).then(function(result3) {
            var timeseriesFiltered2;
            if (!result3.error) {
              timeseriesFiltered2 = result3.result;
              updateViz(timestamps, timeseries, timeseriesFiltered2, []);
              var dataAnalysisAlgo = $('#dataAnalysis').val();
              console.log("Analyzing...", dataAnalysisAlgo);
              return algoClient.algo(dataAnalysisAlgo).pipe(timeseriesFiltered2).then(function(result4) {
                var dataSize, forecastSize, i, lastDate, timeseriesAnalysis, _i, _ref;
                if (!result4.error) {
                  timeseriesAnalysis = result4.result;
                  if (dataAnalysisAlgo === "/timeseries/Forecast") {
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
                  if (dataAnalysisAlgo === "/timeseries/AutoCorrelate") {
                    chartOptions = jQuery.extend(true, {}, defaultOptions);
                    chartOptions.series[2].targetAxisIndex = 1;
                    chartOptions.vAxes[1] = {textPosition: 'none'};
                  }
                  updateViz(timestamps, timeseries, timeseriesFiltered2, timeseriesAnalysis);
                  return console.log("Analysis", timeseriesAnalysis);
                } else {
                  return showError("Failed to analyze data", result4.error);
                }
              });
            } else {
              return showError("Failed to filter data", result3.error);
            }
          });
        } else {
          return showError("Failed to filter data", result2.error);
        }
      });
    } else {
      return showError("Failed to load data", result1.error);
    }
  });
};

function showError(errMsg, err) {
  console.error(errMsg, err);
  $('#errorMessage').html('<i class="fa fa-warning text-danger"></i>' + errMsg);
}

var updateViz = function(labels, raw, filtered, analysis) {
  var chartdata = new google.visualization.DataTable();
  console.log('OPTIONS: ',chartOptions.series[2].targetAxisIndex)
  chartdata.addColumn("date", "Date");
  chartdata.addColumn("number", "Raw");
  chartdata.addColumn("number", "Filtered");
  chartdata.addColumn("number", "Analysis");
  chartdata.addRows(transpose([labels, raw, filtered, analysis]));
  chart.draw(chartdata, chartOptions);
};

var transpose = function(arr) {
  return Object.keys(arr[0]).map(function(col) {
    return arr.map(function(row) {
      return row[col];
    });
  });
};