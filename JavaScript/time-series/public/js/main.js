// this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
var algoClient = Algorithmia.client('simajuFPlJfbQ3yDMiOIgOE/3eW1');
var algorithmBuildingPermits = 'ETL/GetBuildingPermitData/0.1.7';

var chart, timeseries, timestamps, timeseriesFiltered, timeseriesAnalysis;

/**
 * once DOM is ready, update vars
 */
$(document).ready(function() {
  setInviteCode('timeseries');
  chart = new google.visualization.ScatterChart($('#timeseries-chart')[0]);
  retrieveData();
});

/**
 * resize chart if window is resized
 */
$(window).resize(function() {
  defaultChartOptions.width = $("#timeseries-controls").width();
  if(timeseriesAnalysis.length) {updateChart();}
});

var defaultChartOptions = {
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

/**
 * get new permits data from server
 */
var retrieveData = function() {
  $('#errorMessage').empty();
  algoClient.algo(algorithmBuildingPermits).pipe($('#dataSource').val()).then(handleDataRetrieval);
};

/**
 * callback for permit data retrieval (triggers analysis)
 * @param result
 * @returns {*}
 */
var handleDataRetrieval = function(result) {
  if (result.error) {return showError("Failed to load data", result.error);}
  timestamps = result.result[0].map(function(ts) {
    return new Date(ts.replace(" ", "T"));
  });
  timeseries = result.result[1];
  runAnalysis();
};

/**
 * filter and analyze already-retrieved permit data; begin rendering chain
 * @returns {*}
 */
var runAnalysis = function() {
  timeseriesFiltered = [];
  timeseriesAnalysis = [];
  if($('#dataFilter1').val()) {
    return algoClient.algo($('#dataFilter1').val()).pipe(timeseries).then(handleFilter1);
  } else if($('#dataFilter2').val()) {
    algoClient.algo($('#dataFilter2').val()).pipe(timeseries).then(handleFilter2);
  } else {
    algoClient.algo($('#dataAnalysis').val()).pipe(timeseries).then(handleAnalysis);
  }
};

/**
 * callback for filter1 data retrieval
 * @param result
 * @returns {*}
 */
var handleFilter1 = function(result) {
  if (result.error) {return showError("Failed to filter data", result.error);}
  timeseriesFiltered = result.result;
  if($('#dataFilter2').val()) {
    algoClient.algo($('#dataFilter2').val()).pipe(timeseriesFiltered).then(handleFilter2);
  } else {
    algoClient.algo($('#dataAnalysis').val()).pipe(timeseriesFiltered).then(handleAnalysis);
  }
};


/**
 * callback for filter1 data retrieval
 * @param result
 * @returns {*}
 */
var handleFilter2 = function(result) {
  if (result.error) {return showError("Failed to filter data", result.error);}
  timeseriesFiltered = result.result;
  return algoClient.algo($('#dataAnalysis').val()).pipe(timeseriesFiltered).then(handleAnalysis);
};


/**
 * callback for analysis data retrieval
 * @param result
 * @returns {*}
 */
var handleAnalysis = function(result) {
  if (result.error) {return showError("Failed to analyze data", result.error);}
  timeseriesAnalysis = result.result;
  updateChart();
};

/**
 * refresh the d3 chart with all new data
 */
var updateChart = function() {
  var timeseriesAnalysisAdjusted = timeseriesAnalysis;
  var timestampsAdjusted = timestamps;
  var chartOptions = defaultChartOptions;
  switch ($('#dataAnalysis').val()) {
    case "/timeseries/Forecast/0.2.x":
      var dataSize = timestamps.length;
      var forecastSize = timeseriesAnalysis.length;
      var lastDate = timestamps[timestamps.length - 1];
      timeseriesAnalysisAdjusted = copy(timeseriesAnalysis);
      timestampsAdjusted = copy(timestamps);
      var i, _i, _ref;
      for (i = _i = 0, _ref = dataSize + forecastSize - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (i < dataSize) {
          timeseriesAnalysisAdjusted[i] = null;
        } else {
          timeseriesAnalysisAdjusted[i] = timeseriesAnalysis[i - dataSize];
          timestampsAdjusted[i] = new Date(lastDate);
          timestampsAdjusted[i].setMonth(lastDate.getMonth() + i - dataSize + 1);
        }
      }
      break;
    case "/timeseries/AutoCorrelate/0.2.x":
      chartOptions = copy(defaultChartOptions);
      chartOptions.series[2].targetAxisIndex = 1;
      chartOptions.vAxes[1] = {textPosition: 'none'};
      break;
  }
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn("date", "Date");
  dataTable.addColumn("number", "Raw");
  dataTable.addColumn("number", "Filtered");
  dataTable.addColumn("number", "Analysis");
  dataTable.addRows(transpose([timestampsAdjusted, timeseries, timeseriesFiltered, timeseriesAnalysisAdjusted]));
  chart.draw(dataTable, chartOptions);
};

/**
 * deep-copy the data
 * @param data
 */
var copy = function(data) {
  return jQuery.extend(true, {}, data);
};

/**
 * transpose an array
 * @param arr
 * @returns {Array}
 */
var transpose = function(arr) {
  return Object.keys(arr[0]).map(function(col) {
    return arr.map(function(row) {
      return row[col];
    });
  });
};

/**
 * display and log an error
 * @param errMsg
 * @param err
 */
function showError(errMsg, err) {
  console.error(errMsg, err);
  $('#errorMessage').html('<i class="fa fa-warning text-danger"></i>' + errMsg);
}
