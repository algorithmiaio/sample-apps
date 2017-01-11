// You can replace these smileys with anything you'd like.
// Consider adding CSS classes for different colors, images, or some other representation of the sentiment.
// See https://algorithmia.com/algorithms/nlp/SentimentAnalysis to understand the output.

var smileys = [
  '<i class="fa fa-frown-o"></i>',
  '<i class="fa fa-frown-o"></i>',
  '<i class="fa fa-meh-o"></i>',
  '<i class="fa fa-smile-o"></i>',
  '<i class="fa fa-smile-o"></i>'
];

function sentiment(itemText, sentimentElement) {
  startTask();

  // Query sentiment algorithm
  Algorithmia.query("/nlp/SentimentAnalysis", Algorithmia.api_key, itemText, function(error, sentimentScore) {
    finishTask();
    // Print debug output
    if(error) {
      document.getElementById("demo-status").innerHTML = '<span class="text-danger">' + error + '</span>';
      return;
    }
    sentimentElement.innerHTML = smileys[sentimentScore];
  });
}