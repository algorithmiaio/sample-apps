// main.js

window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "simeyUbLXQ/R8Qga/3ZCRGcr2oR1"

function callAlgorithm() {

  var statusLabel = document.getElementById("status-label")

  statusLabel.innerHTML = "";
  startTask();

  // Get the repo address
  var repo = document.getElementById("repository").value;
  // remove any whitespaces around the user/repo name
  repo = repo.trim();
  
  parseRepo(repo);

  // Clear values to prep for new data
  statusLabel.innerHTML = "";
  
  // Query algorithm
  Algorithmia.client(Algorithmia.api_key).algo('nlp/AnalyzeGithubReadme').pipe(repo, function(result) {
    finishTask();
    if(result.error) {
      // Print error output
      statusLabel.innerHTML = '<span class="text-danger">Failed:(' + result.error.message + ')</span>';
      return;
    } else {
      parseScores(result.result);
      parseRecommendations(result.result);
    }
  });
};

function parseRepo(result){
  var whatRepo  = document.getElementById("repoanalyzed");
  whatRepo.innerHTML = '';
  whatRepo.innerHTML = "We've analyzed the README for <a href='https://github.com/"+result+"' target=_'blank'>" +result+ "</a>, and here's what we've found."

}

function parseRecommendations(result) {
  // updateLengthRecommendation(result.recommendation.length, result.score.length)
  updateCodeSampleRecommendation(result.recommendation.pre, result.score.pre)
  updateImagesRecommendation(result.recommendation.img, result.score.img)

  insertHeadersRecommendations(result.recommendation.header, result.score.header)
  insertParagraphRecommendations(result.recommendation.paragraph, result.score.paragraph)
};

function insertHeadersRecommendations(recommendations, score) {
  //
  var addIt  = document.getElementById("header-rec-operation");
  var headerValue  = document.getElementById("header-rec-value");
  addIt.innerHTML = '';
  headerValue.innerHTML = '';
  var icon = document.createElement('span')

  if (score >= 7){
    icon.className = "glyphicon glyphicon-ok text-success"
    headerValue.innerHTML = "Amazing! Your README header score is " + score + " out of 10."
  } else if (score == 4 || score == 5 || score == 6) {
    icon.className = "glyphicon glyphicon-ok text-default"
    headerValue.innerHTML = "Your README header score is " + score + " out of 10. There's always room for improvement."
  } else if (score == 3 || score == 2 || score == 1) {
    icon.className = "glyphicon glyphicon-remove text-default"
    headerValue.innerHTML = "Uh oh. Your README header score is " + score + " out of 10."
  } else {
    icon.className = "glyphicon glyphicon-ok text-default"
    headerValue.innerHTML = "Your README header score is " + score + " out of 10."
  }
  addIt.appendChild(icon);

//


  var list = document.getElementById('headers-recommendation-list')
  list.innerHTML = ''
  var recs = recommendations
  var addValues =[]
  var subValues =[]

  for (i = 0; i < recs.length; ++i) {

    var operation = recs[i].operation
    var value = recs[i].value

// Create child media tiles for reach recommendation
    if (operation == "insert") {
      addValues.push(value); 
    }
    else { 
      subValues.push(value);  
      }
  } //end for
  
    //Create inserts
    var media = document.createElement('div')
    media.className = "col-md-5 col-md-offset-1"

    var panel = document.createElement('div')
    panel.className = "panel panel-default"

    var media_header = document.createElement('div')
    media_header.className = "panel-heading"

    media_header.innerHTML = "<h3 class='panel-title'>Consider Adding</h3>"

    media.appendChild(panel)
    panel.appendChild(media_header)

    if (addValues.length > 0){
      var media_body = document.createElement('div')
      media_body.className = "panel-body"
      media_body.innerHTML = "<p>Your README could be improved by adding these sections:</p>";
    } else {
      var media_body = document.createElement('div')
      media_body.className = "panel-body"
      media_body.innerHTML = "<p>Awesome! Your README has all the preferred sections.</p>";
    }

    for (i = 0; i < addValues.length; i++){
      if (i < 6) {
        var newSpan = document.createElement('span');
        newSpan.className = "label label-default";
        newSpan.innerHTML = addValues[i];
      
        var space = document.createTextNode(" ");
        
        media_body.appendChild(newSpan);     
        media_body.appendChild(space);
      }
    }


    panel.appendChild(media_body)
    list.appendChild(media)

    //Create deletes
    var media = document.createElement('div')
    media.className = "col-md-5"

    var panel = document.createElement('div')
    panel.className = "panel panel-default"

    var media_header = document.createElement('div')
    media_header.className = "panel-heading"

    media_header.innerHTML = "<h3 class='panel-title'>Try Removing</h3>"

    media.appendChild(panel)
    panel.appendChild(media_header)

    if (subValues.length > 0){
      var media_body = document.createElement('div')
      media_body.className = "panel-body"
      media_body.innerHTML = "<p>Popular README's typically don't have these sections:</p>";
    } else {
      var media_body = document.createElement('div')
      media_body.className = "panel-body"
      
      if (score >= 4){
        media_body.innerHTML = "<p>Nice! No sections to remove.</p>";
      } else {
        media_body.innerHTML = "<p>No recommendations to make.</p>";
      }
    }

    for (i = 0; i < subValues.length; i++){
      if (i < 6){
        var newSpan = document.createElement('span');
        newSpan.className = "label label-default";
        newSpan.innerHTML = subValues[i];
      
        var space = document.createTextNode(" ");
        
        media_body.appendChild(newSpan);     
        media_body.appendChild(space);
      }
    }

    panel.appendChild(media_body)
    list.appendChild(media)
      
     
      
    console.log(addValues);
    console.log(subValues);
     
  }

function insertParagraphRecommendations(recommendations, score) {
  //
  var addIt  = document.getElementById("paragraph-rec-operation");
  var paragraphValue  = document.getElementById("paragraph-rec-value");
  addIt.innerHTML = '';
  paragraphValue.innerHTML = '';
  var icon = document.createElement('span')

  if (score >= 7){
    icon.className = "glyphicon glyphicon-ok text-success"
    paragraphValue.innerHTML = "Amazing! Your README text score is " + score + " out of 10."
  } else if (score == 4 || score == 5 || score == 6) {
    icon.className = "glyphicon glyphicon-ok text-default"
    paragraphValue.innerHTML = "Your README text score is " + score + " out of 10. There's always room for improvement."
  } else if (score == 3 || score == 2 || score == 1) {
    icon.className = "glyphicon glyphicon-remove text-default"
    paragraphValue.innerHTML = "Uh oh. Your README text score is " + score + " out of 10."
  } else {
    icon.className = "glyphicon glyphicon-ok text-default"
    paragraphValue.innerHTML = "Your README text score is " + score + " out of 10."
  }
  addIt.appendChild(icon);

//

  var list = document.getElementById('paragraphs-recommendation-list')
  list.innerHTML = ''
  var recs = recommendations
  var addValues =[]
  var subValues =[]

  for (i = 0; i < recs.length; ++i) {

    var operation = recs[i].operation
    var value = recs[i].value

// Create child media tiles for reach recommendation
    if (operation == "insert") {
      addValues.push(value); 
    }
    else { 
      subValues.push(value);  
      }
  } //end for
  
    //Create inserts
    var media = document.createElement('div')
    media.className = "col-md-5 col-md-offset-1"

    var panel = document.createElement('div')
    panel.className = "panel panel-default"

    var media_header = document.createElement('div')
    media_header.className = "panel-heading"

    media_header.innerHTML = "<h3 class='panel-title'>Consider Adding</h3>"

    media.appendChild(panel)
    panel.appendChild(media_header)


    if (addValues.length > 0){
      var media_body = document.createElement('div')
      media_body.className = "panel-body"
      media_body.innerHTML = "<p>Popular README's tend to use more of these words:</p>";
    } else {
      var media_body = document.createElement('div')
      media_body.className = "panel-body"
      media_body.innerHTML = "<p>Nice! Nothing to add.</p>";
    }

    for (i = 0; i < addValues.length; i++){
      if (i < 6){
        var newSpan = document.createElement('span');
        newSpan.className = "label label-default";
        newSpan.innerHTML = addValues[i];
      
        var space = document.createTextNode(" ");
        
        media_body.appendChild(newSpan);     
        media_body.appendChild(space);
      }
    }

    panel.appendChild(media_body)
    list.appendChild(media)

    //Create deletes
    var media = document.createElement('div')
    media.className = "col-md-5"

    var panel = document.createElement('div')
    panel.className = "panel panel-default"

    var media_header = document.createElement('div')
    media_header.className = "panel-heading"

    media_header.innerHTML = "<h3 class='panel-title'>Try Removing</h3>"

    media.appendChild(panel)
    panel.appendChild(media_header)

    if (subValues.length > 0){
      var media_body = document.createElement('div')
      media_body.className = "panel-body"
      media_body.innerHTML = "<p>These words aren't typically found in popular README's:</p>";
    } else {
      var media_body = document.createElement('div')
      media_body.className = "panel-body"
      
      if (score >= 4){
        media_body.innerHTML = "<p>Nice! No sections to remove.</p>";
      } else {
        media_body.innerHTML = "<p>No recommendations to make.</p>";
      }
    }

    for (i = 0; i < subValues.length; i++){
      if (i < 6) {
        var newSpan = document.createElement('span');
        newSpan.className = "label label-default";
        newSpan.innerHTML = subValues[i];
      
        var space = document.createTextNode(" ");
        
        media_body.appendChild(newSpan);     
        media_body.appendChild(space);
      }
    }
    panel.appendChild(media_body)
    list.appendChild(media)
}

// OK BELOW //

function updateLengthRecommendation(length_rec, score) {
  var operation  = document.getElementById("length-recommendation-operation");
  var value  = document.getElementById("length-recommendation-value");
  operation.innerHTML = '';
  value.innerHTML = '';

  var icon = document.createElement('span')

//
  if (score >= 7){
    if (length_rec.length == 0){
      icon.className = "glyphicon glyphicon-ok text-success"
      value.innerHTML = "Amazing! Your README scored " + score + " out of 10 on character count. We have no recommendations to make."
    } else if (length_rec[0].operation == 'decrease'){
      icon.className = "glyphicon glyphicon-ok text-default"
      var rec = "Excellent. Your README scored " + score + " out of 10 on character count. Want to improve even more? Try removing up to " + length_rec[0].value + " characters."
      value.innerHTML = rec
    } else if (length_rec[0].operation == 'increase'){
      icon.className = "glyphicon glyphicon-ok text-default"
      var rec = "Very nice. Your README scored " + score + " out of 10 on character count. Want to do better? Consider adding " + length_rec[0].value + " or more characters to improve your score."
      value.innerHTML = rec
    } else {
      icon.className = "glyphicon glyphicon-ok text-default"
      value.innerHTML = "Good job! We have no recommendations to make."
    }
  } else if (score == 4 || score == 5 || score == 6) {
      if (length_rec.length == 0){
        icon.className = "glyphicon glyphicon-ok text-default"
        value.innerHTML = "Your README scored " + score + " out of 10 on character count. There's always room for improvement, but we don't have a suggestion."
      } else if (length_rec[0].operation == 'decrease'){
        icon.className = "glyphicon glyphicon-ok text-default"
        var rec = "Your README scored " + score + " out of 10 on character count. Consider removing up to " + length_rec[0].value + " characters to improve your score."
        value.innerHTML = rec
      } else if (length_rec[0].operation == 'increase'){
        icon.className = "glyphicon glyphicon-ok text-default"
        var rec = "Your README scored " + score + " out of 10 on character count. Try adding " + length_rec[0].value + " or more characters to improve your score."
        value.innerHTML = rec
      } else {
        icon.className = "glyphicon glyphicon-ok text-default"
        value.innerHTML = "We have no recommendations to make."
      }
  } else if (score == 3 || score == 2 || score == 1) {
      if (length_rec.length == 0){
        icon.className = "glyphicon glyphicon-remove text-default"
        value.innerHTML = "Uh oh. Your README scored " + score + " out of 10 on character count. That's pretty low, but we don't have a suggestion for improvement."
      } else if (length_rec[0].operation == 'decrease'){
        icon.className = "glyphicon glyphicon-remove text-default"
        var rec = "Woah! Your README scored " + score + " out of 10 on character count. Consider removing up to " + length_rec[0].value + " characters to improve your score."
        value.innerHTML = rec
      } else if (length_rec[0].operation == 'increase'){
        icon.className = "glyphicon glyphicon-remove text-default"
        var rec = "Yikes! Your README scored " + score + " out of 10 on character count. Try adding " + length_rec[0].value + " or more characters to improve your score."
        value.innerHTML = rec
      } else {
        icon.className = "glyphicon glyphicon-remove text-default"
        value.innerHTML = "We have no recommendations to make."
      }
  } else {
    icon.className = "glyphicon glyphicon-ok text-default"
    value.innerHTML = "We have no recommendations to make."
  }
//

  operation.appendChild(icon);
}

function updateCodeSampleRecommendation(code_rec, score) {
  var operation  = document.getElementById("code-recommendation-operation");
  var value  = document.getElementById("code-recommendation-value");
  operation.innerHTML = '';
  value.innerHTML = '';

  var icon = document.createElement('span')

//
  if (score >= 7){
    if (code_rec.length == 0){
      icon.className = "glyphicon glyphicon-ok text-success"
      value.innerHTML = "Amazing! Your README scored " + score + " out of 10 on code samples. No need to change anything."
    } else if (code_rec[0].operation == 'decrease'){
      icon.className = "glyphicon glyphicon-ok text-default"
      var rec = "Excellent. Your README scored " + score + " out of 10 on code samples. You're all set."
      value.innerHTML = rec
    } else if (code_rec[0].operation == 'increase'){
      icon.className = "glyphicon glyphicon-ok text-default"
      var rec = "Very nice. Your README scored " + score + " out of 10 on code samples. It wouldn't hurt to add a few more to your README."
      value.innerHTML = rec
    } else {
      icon.className = "glyphicon glyphicon-ok text-default"
      value.innerHTML = "Good job! We have no recommendations to make."
    }
  } else if (score == 4 || score == 5 || score == 6) {
      if (code_rec.length == 0){
        icon.className = "glyphicon glyphicon-ok text-default"
        value.innerHTML = "Your README scored " + score + " out of 10 on code samples. There's always room for improvement, but we don't have a suggestion."
      } else if (code_rec[0].operation == 'decrease'){
        icon.className = "glyphicon glyphicon-ok text-default"
        var rec = "Your README scored " + score + " out of 10 on code samples. Consider removing a few to improve your score."
        value.innerHTML = rec
      } else if (code_rec[0].operation == 'increase'){
        icon.className = "glyphicon glyphicon-ok text-default"
        var rec = "Your README scored " + score + " out of 10 on code samples. You're a little light on code samples. It wouldn't hurt to add a few more to your README."
        value.innerHTML = rec
      } else {
        icon.className = "glyphicon glyphicon-ok text-default"
        value.innerHTML = "We have no recommendations to make."
      }
  } else if (score == 3 || score == 2 || score == 1) {
      if (code_rec.length == 0){
        icon.className = "glyphicon glyphicon-remove text-default"
        value.innerHTML = "Uh oh. Your README scored " + score + " out of 10 on code samples. That's pretty low, but we don't have a suggestion for improvement."
      } else if (code_rec[0].operation == 'decrease'){
        icon.className = "glyphicon glyphicon-remove text-default"
        var rec = "Code overload! Your README scored " + score + " out of 10 on code samples. Consider removing a few."
        value.innerHTML = rec
      } else if (code_rec[0].operation == 'increase'){
        icon.className = "glyphicon glyphicon-remove text-default"
        var rec = "Yikes! Your README scored " + score + " out of 10 on code samples. We recommend adding more code samples to your README."
        value.innerHTML = rec
      } else {
        icon.className = "glyphicon glyphicon-remove text-default"
        value.innerHTML = "We have no recommendations to make."
      }
  } else {
    icon.className = "glyphicon glyphicon-ok text-default"
    value.innerHTML = "We have no recommendations to make."
  }
//

  operation.appendChild(icon);
}

function updateImagesRecommendation(img_rec, score) {
  var operation  = document.getElementById("images-recommendation-operation");
  var value  = document.getElementById("images-recommendation-value");
  operation.innerHTML = '';
  value.innerHTML = '';

  var icon = document.createElement('span')

// Scoring for images
  if (score >= 7){
    if (img_rec.length == 0){
      icon.className = "glyphicon glyphicon-ok text-success"
      value.innerHTML = "Amazing! Your README image score is " + score + " out of 10. We have no recommendations to make."
    } else if (img_rec[0].operation == 'decrease'){
      icon.className = "glyphicon glyphicon-ok text-default"
      var rec = "Excellent. Your README image score is " + score + " out of 10. You're good to go."
      value.innerHTML = rec
    } else if (img_rec[0].operation == 'increase'){
      icon.className = "glyphicon glyphicon-ok text-default"
      var rec = "Very nice. Your README image score is " + score + " out of 10."
      value.innerHTML = rec
    } else {
      icon.className = "glyphicon glyphicon-ok text-default"
      value.innerHTML = "Good job! We have no recommendations to make."
    }
  } else if (score == 4 || score == 5 || score == 6) {
      if (img_rec.length == 0){
        icon.className = "glyphicon glyphicon-ok text-default"
        value.innerHTML = "Your README image score is " + score + " out of 10. There's always room for improvement, but we don't have a suggestion."
      } else if (img_rec[0].operation == 'decrease'){
        icon.className = "glyphicon glyphicon-ok text-default"
        var rec = "Your README image score is " + score + " out of 10. Most README's have fewer images."
        value.innerHTML = rec
      } else if (img_rec[0].operation == 'increase'){
        icon.className = "glyphicon glyphicon-ok text-default"
        var rec = "Your README image score is " + score + " out of 10. Most README's have two or more images"
        value.innerHTML = rec
      } else {
        icon.className = "glyphicon glyphicon-ok text-default"
        value.innerHTML = "We have no recommendations to make."
      }
  } else if (score == 3 || score == 2 || score == 1) {
      if (img_rec.length == 0){
        icon.className = "glyphicon glyphicon-remove text-default"
        value.innerHTML = "Uh oh. Your README image score is " + score + " out of 10. That's a little low, but we don't have a suggestion for improvement."
      } else if (img_rec[0].operation == 'decrease'){
        icon.className = "glyphicon glyphicon-remove text-default"
        var rec = "Image overload! Your README image score is " + score + " out of 10. Consider removing a few."
        value.innerHTML = rec
      } else if (img_rec[0].operation == 'increase'){
        icon.className = "glyphicon glyphicon-remove text-default"
        var rec = "Yikes! Your README image score is " + score + " out of 10. Most README's have two or more images."
        value.innerHTML = rec
      } else {
        icon.className = "glyphicon glyphicon-remove text-default"
        value.innerHTML = "We have no recommendations to make."
      }
  } else {
    icon.className = "glyphicon glyphicon-ok text-default"
    value.innerHTML = "We have no recommendations to make."
  }

  operation.appendChild(icon);
}

function parseScores(result) {
  var overview = document.getElementsByClassName("overview-score");
  // Removing Lenght, bc not correlated with a good result.
  // var length  = document.getElementsByClassName("length-score");
  var headers = document.getElementsByClassName("headers-score");
  var code    = document.getElementsByClassName("code-score");
  var parag   = document.getElementsByClassName("paragraph-score");
  var img     = document.getElementsByClassName("image-score");

  var score = result.score
  var scores = new Array(score.pre, score.header, /*score.length,*/ score.paragraph, score.img)
  
  //calculate overall avg score
  var sum =0;
  for (var i = 0; i < scores.length; i++){
    sum += parseInt( scores[i],10);
  }

  var overScore = Math.ceil(sum/scores.length);

  scores.unshift(overScore)

  var elements = new Array(overview, code, headers, /*length,*/ parag, img)

  console.log(elements)

  for (var i in elements) {
    insertGrade(elements[i], scores[i]);
  }
};

function insertGrade(elements, score) {
  var grade_divs = elements;
  var score = score;

  for (i = 0; i < grade_divs.length; ++i) {
    
    var grade = grade_divs[i]

    if (score >= 10) {
      grade.style.color = '#5cb85c';
      grade.innerHTML = "A+";
    } else if (score == 9) {
      grade.style.color = '#5cb85c';
      grade.innerHTML = "A";
    } else if (score == 7 || score == 8) {
      grade.style.color = '#5cb85c';
      grade.innerHTML = "B";
    } else if (score == 4 || score == 5 || score == 6) {
      grade.style.color = '#f0ad4e';
      grade.innerHTML = "C";
    } else if (score == 3 || score == 2) {
      grade.style.color = '#d9534f';
      grade.innerHTML = "D";
    } else if (score == 1) {
      grade.style.color = '#d9534f';
      grade.innerHTML = "F";
    } else {
      grade.style.color = '#f0ad4e';
      grade.innerHTML = "C";
    };
  }

};

function analyzeDefault(repo) {
  document.getElementById("repository").value = repo;
  callAlgorithm();
}

var numTasks = 0;

function startTask() {
  numTasks++;
  document.getElementById("overlay").classList.remove("hidden");
}
function finishTask() {
  numTasks--;
  if(numTasks <= 0) {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("explainer").classList.add("hidden");
    document.getElementById("recs").classList.remove("hidden");

  }
}