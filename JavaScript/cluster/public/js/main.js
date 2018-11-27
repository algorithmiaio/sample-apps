// this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
var apiKey = 'simRN+PoQevVd6ePYU9t/kEH4MM1'

var svg = d3.select("svg.viz");

var n = 40;           // Number of points
var dataPoints = [];  // Point data

// Color scale
var colorScale = d3.scale.category10();

var client = Algorithmia.client(apiKey, 'https://api.algorithmia.com/v1/web/algo');

// Generate initial data
window.addEventListener("load", function() {
  generateData();
  updateD3();
});

// Setup mappings from data to visualization using D3
function updateD3() {
  Algorithmia.viz.drawPoints(svg, dataPoints, "points", 4, colorScale);
};

// Generate random data
function generateData() {
  var width = $(".viz-container").width();
  var height = $(".viz-container").height();

  dataPoints.length = 0;
  for(var i = 0; i < n; i++) {
    randomPoint = [Math.random() * width, Math.random() * height];
    dataPoints.push(randomPoint);
  }

  // Print debug output
  var numTopics = document.getElementById("numClusters").value;
  var algorithmInput = [dataPoints, numTopics];
  // document.getElementById("geodata-out").innerHTML = "<pre>" + JSON.stringify(algorithmInput, null, 2) + "</pre>";
  document.getElementById("cluster-in").innerHTML = "<pre>" + JSON.stringify(algorithmInput, null, 2) + "</pre>";
  document.getElementById("cluster-out").innerHTML = "";

  updateD3();
};

// Cluster the dataPoints using Algorithmia k-means clustering
function cluster() {
  document.getElementById("demo-status").innerHTML = "";

  // Algorithm input
  var numTopics = document.getElementById("numClusters").value;
  var algorithmInput = [dataPoints, numTopics];
  document.getElementById("cluster-in").innerHTML = "<pre>" + JSON.stringify(algorithmInput, null, 2) + "</pre>";

  // Query Algorithmia /kenny/WekaCluster
  client.algo("/kenny/WekaCluster").pipe(algorithmInput).then(function(result) {
    // Print debug output
    if(result.error) {
      document.getElementById("cluster-out").innerHTML = '<div class="text-danger">' + (result.error.message || result.error) + '</div>';
      document.getElementById("demo-status").innerHTML = '<span class="text-danger">' + (result.error.message || result.error) + '</span>';
      return;
    }
    algorithmOutput = result.result;
    document.getElementById("cluster-out").innerHTML = "<pre>" + JSON.stringify(algorithmOutput, null, 2) + "</pre>";
    // Save result
    dataPoints = algorithmOutput;
    // Update visualization
    updateD3();
  });
};