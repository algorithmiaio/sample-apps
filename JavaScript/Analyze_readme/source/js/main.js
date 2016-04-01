// main.js

window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "simGpDplaouYGZhf2WGltne49SV1"

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

  updateLengthRecommentation(result.recommendation.length)
  updateCodeSampleRecommentation(result.recommendation.pre)
  updateImagesRecommentation(result.recommendation.img)

  insertHeadersRecommendations(result.recommendation.header)
  insertParagraphRecommendations(result.recommendation.paragraph)
};

function insertHeadersRecommendations(recommendations) {
  var list = document.getElementById('headers-recommendation-list')
  list.innerHTML = ''
  var recs = recommendations

  for (i = 0; i < recs.length; ++i) {

    var operation = recs[i].operation
    var value = recs[i].value

// Create child media tiles for reach recommendation
    var media = document.createElement('div')
    media.className = "media"

    var media_header = document.createElement('div')
    media_header.className = "media-left operation"

    media.appendChild(media_header)

    var icon = document.createElement('span')

    if (operation == "insert") {
      icon.className = "glyphicon glyphicon-pencil"
    } else {
      icon.className = "glyphicon glyphicon-remove"
    }

    media_header.appendChild(icon)

    var media_body = document.createElement('div')
    media_body.className = "media-body"
    var recommendation = document.createElement('h4')

    if (operation == "insert") {
      recommendation.innerHTML = "Try adding a header to one of your sections with the stem: <span style='color:green;'>" + value + "</span>"
    } else {
      recommendation.innerHTML = "Remove the header which starts with the stem: <span style='color:red;'>" + value + "</span>"
    }
   
    media_body.appendChild(recommendation)
    media.appendChild(media_body)
    list.appendChild(media)
  }
}

function insertParagraphRecommendations(recommendations) {
  var list = document.getElementById('paragraphs-recommendation-list')
  list.innerHTML = ''
  var recs = recommendations

  for (i = 0; i < recs.length; ++i) {

    var operation = recs[i].operation
    var value = recs[i].value

// Create child media tiles for reach recommendation
    var media = document.createElement('div')
    media.className = "media"

    var media_header = document.createElement('div')
    media_header.className = "media-left operation"

    media.appendChild(media_header)

    var icon = document.createElement('span')

    if (operation == "insert") {
      icon.className = "glyphicon glyphicon-pencil"
    } else {
      icon.className = "glyphicon glyphicon-remove"
    }

    media_header.appendChild(icon)

    var media_body = document.createElement('div')
    media_body.className = "media-body"
    var recommendation = document.createElement('h4')

    if (operation == "insert") {
      recommendation.innerHTML = "Add words with the stem: <span style='color:green;'>" + value + "</span>" 
    } else {
      recommendation.innerHTML = "Remove words which start with the stem: <span style='color:red;'>" + value + "</span>"
    }
   
    media_body.appendChild(recommendation)
    media.appendChild(media_body)

    list.appendChild(media)
  }
}

// OK BELOW //

function updateLengthRecommentation(length_rec) {
  var operation  = document.getElementById("length-recommendation-operation");
  var value  = document.getElementById("length-recommendation-value");
  operation.innerHTML = '';
  value.innerHTML = '';

  var icon = document.createElement('span')

  if (length_rec.length == 0) {
    icon.className = "glyphicon glyphicon-ok"
    value.innerHTML = "Juuuust right! Then length of your README is neither too long nor too short."
  } else if (length_rec[0].operation == 'increase'){
    icon.className = "glyphicon glyphicon-pencil"
    var rec = "Cat got your tongue? Consider increasing the length of your README by " + length_rec[0].value + " characters."
    value.innerHTML = rec
  } else if (length_rec[0].operation == 'decrease'){
    icon.className = "glyphicon glyphicon-remove"
    var rec = "Woof, it's a long one! Consider decreasing the length of your README by " + length_rec[0].value + " characters."
    value.innerHTML = rec
  } else {
    icon.className = "glyphicon glyphicon-ok"
    value.innerHTML = "Juuuust right! Then length of your README is neither too long nor too short."
  }

  operation.appendChild(icon);
}

function updateCodeSampleRecommentation(code_rec) {
  var operation  = document.getElementById("code-recommendation-operation");
  var value  = document.getElementById("code-recommendation-value");
  operation.innerHTML = '';
  value.innerHTML = '';

  var icon = document.createElement('span')

  if (code_rec.length == 0) {
    icon.className = "glyphicon glyphicon-ok"
    value.innerHTML = "Great work, your code samples are spot on!"
  } else if (code_rec[0].operation == 'increase'){
    icon.className = "glyphicon glyphicon-pencil"
    var rec = "Have you thought about adding in code samples? We suggest " + code_rec[0].value + "?"
    value.innerHTML = rec
  } else if (code_rec[0].operation == 'decrease'){
    icon.className = "glyphicon glyphicon-remove"
    var rec = "You could probably cut down on code samples. How about removing " + code_rec[0].value + "?"
    value.innerHTML = rec
  } else {
    icon.className = "glyphicon glyphicon-ok"
    value.innerHTML = "Great work, your code samples are spot on!"
  }

  operation.appendChild(icon);
}

function updateImagesRecommentation(img_rec) {
  var operation  = document.getElementById("images-recommendation-operation");
  var value  = document.getElementById("images-recommendation-value");
  operation.innerHTML = '';
  value.innerHTML = '';

  var icon = document.createElement('span')

  if (img_rec.length == 0){
    icon.className = "glyphicon glyphicon-ok"
    value.innerHTML = "No recommendations found for your README's image count. Good job!"
  } else if (img_rec[0].operation == 'decrease'){
    icon.className = "glyphicon glyphicon-remove"
    var rec = "Consider decreasing the number of images by " + img_rec[0].value
    value.innerHTML = rec
  } else if (img_rec[0].operation == 'increase'){
    icon.className = "glyphicon glyphicon-pencil"
    var rec = "Consider increasing the number of images by " + img_rec[0].value
    value.innerHTML = rec
  } else {
    icon.className = "glyphicon glyphicon-ok"
    value.innerHTML = "No recommendations found for your README's image count. Good job!"
  }

  operation.appendChild(icon);
}

function parseScores(result) {
  var length  = document.getElementsByClassName("length-score");
  var headers = document.getElementsByClassName("headers-score");
  var code    = document.getElementsByClassName("code-score");
  var parag   = document.getElementsByClassName("paragraph-score");
  var img     = document.getElementsByClassName("image-score");

  var score = result.score
  var scores = new Array(score.pre, score.header, score.length, score.paragraph, score.img)
  var elements = new Array(code, headers, length, parag, img)

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
      grade.style.color = 'green';
      grade.innerHTML = "A+";
    } else if (score == 8) {
      grade.style.color = 'green';
      grade.innerHTML = "A";
    } else if (score == 7 || score == 6) {
      grade.style.color = 'green';
      grade.innerHTML = "B";
    } else if (score == 5) {
      grade.style.color = 'orange';
      grade.innerHTML = "C";
    } else if (score == 4) {
      grade.style.color = 'orange';
      grade.innerHTML = "C-";
    } else if (score == 3) {
      grade.innerHTML = "D";
    } else if (score == 2 || score == 1) {
      grade.innerHTML = "F";
    } else {
      grade.style.color = 'orange';
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
  }
}