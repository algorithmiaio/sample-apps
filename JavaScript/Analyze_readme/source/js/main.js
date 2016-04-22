// main.js

window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "simeyUbLXQ/R8Qga/3ZCRGcr2oR1"

function callAlgorithm() {

  var statusLabel = document.getElementById("status-label")

  statusLabel.innerHTML = "";
  startTask();

  // Get the repo address
  var repo = document.getElementById("repository").value;

  // Clear values to prep for new data
  statusLabel.innerHTML = "";

  // Query algorithm
  Algorithmia.query('nlp/AnalyzeGithubReadme', Algorithmia.api_key, repo, function(error, result) {
    finishTask();
    // Print debug output
    if(error) {
      statusLabel.innerHTML = '<span class="text-danger">Failed:(' + error + ')</span>';
      return;
    }

    parseScores(result)
    parseRecommendations(result)
  });
};

function parseRecommendations(result) {



  updateLengthRecommendation(result.recommendation.length)
  updateCodeSampleRecommendation(result.recommendation.pre)
  updateImagesRecommendation(result.recommendation.img)

  insertHeadersRecommendations(result.recommendation.header)
  insertParagraphRecommendations(result.recommendation.paragraph)
};

function insertHeadersRecommendations(recommendations) {
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

    media_header.innerHTML = "<h3 class='panel-title'>Additions</h3>"

    media.appendChild(panel)
    panel.appendChild(media_header)


    var media_body = document.createElement('div')
    media_body.className = "panel-body";
    media_body.innerHTML = "<p>Try adding a few of these sections:</p>";

    for (i = 0; i < addValues.length; i++){
      var newSpan = document.createElement('span');
      newSpan.className = "label label-success";
      newSpan.innerHTML = addValues[i];
    
      var space = document.createTextNode(" ");
      
      media_body.appendChild(newSpan);     
      media_body.appendChild(space);
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

    media_header.innerHTML = "<h3 class='panel-title'>Deletions</h3>"

    media.appendChild(panel)
    panel.appendChild(media_header)

    var media_body = document.createElement('div')
    media_body.className = "panel-body"
    media_body.innerHTML = "<p>Try replacing these headers:</p>";

    for (i = 0; i < subValues.length; i++){
      var newSpan = document.createElement('span');
      newSpan.className = "label label-danger";
      newSpan.innerHTML = subValues[i];
    
      var space = document.createTextNode(" ");
      
      media_body.appendChild(newSpan);     
      media_body.appendChild(space);
    }

    panel.appendChild(media_body)
    list.appendChild(media)
      
     
      
    console.log(addValues);
    console.log(subValues);
     
  }

function insertParagraphRecommendations(recommendations) {
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

    media_header.innerHTML = "<h3 class='panel-title'>Additions</h3>"

    media.appendChild(panel)
    panel.appendChild(media_header)

    var media_body = document.createElement('div')
    media_body.className = "panel-body"
    media_body.innerHTML = "<p>Try using more of these words:</p>";

    for (i = 0; i < addValues.length; i++){
      var newSpan = document.createElement('span');
      newSpan.className = "label label-success";
      newSpan.innerHTML = addValues[i];
    
      var space = document.createTextNode(" ");
      
      media_body.appendChild(newSpan);     
      media_body.appendChild(space);
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

    media_header.innerHTML = "<h3 class='panel-title'>Deletions</h3>"

    media.appendChild(panel)
    panel.appendChild(media_header)

    var media_body = document.createElement('div')
    media_body.className = "panel-body"
    media_body.innerHTML = "<p>Try replacing these words:</p>";

    for (i = 0; i < subValues.length; i++){
      var newSpan = document.createElement('span');
      newSpan.className = "label label-danger";
      newSpan.innerHTML = subValues[i];
    
      var space = document.createTextNode(" ");
      
      media_body.appendChild(newSpan);     
      media_body.appendChild(space);
    }
    panel.appendChild(media_body)
    list.appendChild(media)
}

// OK BELOW //

function updateLengthRecommendation(length_rec) {
  var operation  = document.getElementById("length-recommendation-operation");
  var value  = document.getElementById("length-recommendation-value");
  operation.innerHTML = '';
  value.innerHTML = '';

  var icon = document.createElement('span')

  if (length_rec.length == 0) {
    icon.className = "glyphicon glyphicon-ok"
    value.innerHTML = "Juuuust right! Then length of your README is neither too long nor too short."
  } else if (length_rec[0].operation == 'increase'){
    icon.className = "glyphicon glyphicon-pencil text-primary"
    var rec = "Cat got your tongue? Consider increasing the length of your README by " + length_rec[0].value + " characters."
    value.innerHTML = rec
  } else if (length_rec[0].operation == 'decrease'){
    icon.className = "glyphicon glyphicon-remove text-danger"
    var rec = "Woof, it's a long one! Consider decreasing the length of your README by " + length_rec[0].value + " characters."
    value.innerHTML = rec
  } else {
    icon.className = "glyphicon glyphicon-ok text-success"
    value.innerHTML = "Juuuust right! Then length of your README is neither too long nor too short."
  }

  operation.appendChild(icon);
}

function updateCodeSampleRecommendation(code_rec) {
  var operation  = document.getElementById("code-recommendation-operation");
  var value  = document.getElementById("code-recommendation-value");
  operation.innerHTML = '';
  value.innerHTML = '';

  var icon = document.createElement('span')

  if (code_rec.length == 0) {
    icon.className = "glyphicon glyphicon-ok"
    value.innerHTML = "Great work, your code samples are spot on!"
  } else if (code_rec[0].operation == 'increase'){
    icon.className = "glyphicon glyphicon-pencil text-primary"
    var rec = "Have you thought about adding in code samples? We suggest " + code_rec[0].value + "?"
    value.innerHTML = rec
  } else if (code_rec[0].operation == 'decrease'){
    icon.className = "glyphicon glyphicon-remove text-danger"
    var rec = "You could probably cut down on code samples. How about removing " + code_rec[0].value + "?"
    value.innerHTML = rec
  } else {
    icon.className = "glyphicon glyphicon-ok text-success"
    value.innerHTML = "Great work, your code samples are spot on!"
  }

  operation.appendChild(icon);
}

function updateImagesRecommendation(img_rec) {
  var operation  = document.getElementById("images-recommendation-operation");
  var value  = document.getElementById("images-recommendation-value");
  operation.innerHTML = '';
  value.innerHTML = '';

  var icon = document.createElement('span')

  if (img_rec.length == 0){
    icon.className = "glyphicon glyphicon-ok text-primary"
    value.innerHTML = "No recommendations found for your README's image count. Good job!"
  } else if (img_rec[0].operation == 'decrease'){
    icon.className = "glyphicon glyphicon-remove text-danger"
    var rec = "Consider decreasing the number of images by " + img_rec[0].value
    value.innerHTML = rec
  } else if (img_rec[0].operation == 'increase'){
    icon.className = "glyphicon glyphicon-pencil text-primary"
    var rec = "Consider increasing the number of images by " + img_rec[0].value
    value.innerHTML = rec
  } else {
    icon.className = "glyphicon glyphicon-ok text-success"
    value.innerHTML = "No recommendations found for your README's image count. Good job!"
  }

  operation.appendChild(icon);
}

function parseScores(result) {
  var overview = document.getElementsByClassName("overview-score");
  var length  = document.getElementsByClassName("length-score");
  var headers = document.getElementsByClassName("headers-score");
  var code    = document.getElementsByClassName("code-score");
  var parag   = document.getElementsByClassName("paragraph-score");
  var img     = document.getElementsByClassName("image-score");

  var score = result.score
  var scores = new Array(score.pre, score.header, score.length, score.paragraph, score.img)
  
  //calculate overall avg score
  var sum =0;
  for (var i = 0; i < scores.length; i++){
    sum += parseInt( scores[i],10);
  }

  var overScore = Math.ceil(sum/scores.length);

  scores.unshift(overScore)

  var elements = new Array(overview, code, headers, length, parag, img)

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

    if (score >= 9) {
      grade.style.color = '#5cb85c';
      grade.innerHTML = "A+";
    } else if (score == 8) {
      grade.style.color = '#5cb85c';
      grade.innerHTML = "A";
    } else if (score == 7 || score == 6) {
      grade.style.color = '#5cb85c';
      grade.innerHTML = "B";
    } else if (score == 5) {
      grade.style.color = '#f0ad4e';
      grade.innerHTML = "C";
    } else if (score == 4) {
      grade.style.color = '#f0ad4e';
      grade.innerHTML = "C-";
    } else if (score == 3) {
      grade.style.color = '#777';
      grade.innerHTML = "D";
    } else if (score == 2 || score == 1) {
      grade.style.color = '#d9534f';
      grade.innerHTML = "F";
    } else {
      grade.style.color = '#f0ad4e';
      grade.innerHTML = "C";
    };
  }

};

var numTasks = 0;

function startTask() {
  numTasks++;
  document.getElementById("overlay").classList.remove("hidden");
}
function finishTask() {
  numTasks--;
  if(numTasks <= 0) {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("recs").classList.remove("hidden");

  }
}