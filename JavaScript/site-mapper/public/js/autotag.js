// Auto tag reads the text of the item and uses a Latent Dirichlet allocation
// algorithm to create topic tags.
// Read about the algorithm here: https://algorithmia.com/algorithms/nlp/AutoTag

function autotag(itemText, tagsElement) {
  startTask();

  var topics = [];
  var topicLabels = [];

  if(typeof(itemText) == "string") {
    itemText = itemText.split("\n");
  } else {
    itemText = [];
  }

  // Query auto tag algorithm
  Algorithmia.query("/nlp/AutoTag", Algorithmia.api_key, itemText, function(error, topics) {
    finishTask();
    // Print debug output
    if(error) {
      document.getElementById("demo-status").innerHTML = '<span class="text-danger">' + error + '</span>';
      return;
    }

    for (var key in topics) {
       topicLabels.push('<span class="label label-info">' + topics[key] + '</span> ');
    }

    tagsElement.innerHTML = topicLabels.join('');
  });
}