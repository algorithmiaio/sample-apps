// Summarizer is a natural language processing algorithm that generates key topic sentences.
// Read about this algorithm here: https://algorithmia.com/algorithms/nlp/Summarizer

function summarize(itemText, summaryElement) {
  startTask();

  // Query summarizer algorithm
  Algorithmia.query("/nlp/Summarizer", Algorithmia.api_key, itemText, function(error, summaryText) {
    finishTask();
    // Print debug output
    if(error) {
      document.getElementById("demo-status").innerHTML = '<span class="text-danger">' + error + '</span>';
      return;
    }

    summaryElement.textContent = summaryText;
  });
}
