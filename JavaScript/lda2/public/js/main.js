var svg = d3.select("svg.viz");
var topics = [];

// this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
var client = Algorithmia.client('simqgqIaOE5ScOF4+Wb/L+VsIXg1');

// Update visualization on page load
window.addEventListener("load", function() {
  updateD3();
});

// Render data using D3
function updateD3() {
  var width = $(".viz-container").width();
  var height = $(".viz-container").height();
  Algorithmia.viz.drawTopics(svg, topics, width, height);
};


function analyze() {
  document.getElementById("demo-status").innerHTML = "";

  // Build instance
  var numTopics = document.getElementById("numTopics").value;
  var strings   = document.getElementById("inputStrings").value.split("\n");

  // LDA Input
  var algorithmInput = [
    strings,
    numTopics
  ];
  document.getElementById("topics-in").innerHTML = "<pre>"+JSON.stringify(algorithmInput, null, 2)+"</pre>";
  document.getElementById("topics-out").innerHTML = "";

  // Query topic analysis
  client.algo("/nlp/LDA").pipe(algorithmInput).then(function(new_topics) {
    // Print debug output
    if(new_topics.error) {
      document.getElementById("topics-out").innerHTML = '<span class="text-danger">' + (new_topics.error.message || new_topics.error) + '</span>';
      document.getElementById("demo-status").innerHTML = '<span class="text-danger">' + (new_topics.error.message || new_topics.error) + '</span>';
      return;
    }
    document.getElementById("topics-out").innerHTML = "<pre>" + JSON.stringify(new_topics.result, null, 2) + "</pre>";

    topics = [];
    updateD3();

    topics = new_topics.result;
    updateD3();
  });
};