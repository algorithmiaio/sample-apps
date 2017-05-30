var FRDemo =
{
	init: function()
	{
		var keywords = [
			"algorithmia",
			"microsoft",
			"amazon",
			"google",
			"facebook",
			"reddit"
		];

		// Get random keyword
		var kw = keywords[Math.floor(Math.random() * keywords.length)];

		$("#form input").val(kw);

		// listen to analyze button
		$("#demo a").on("click", FRDemo.analyzeTweets);

		// initialize Algorithmia with demo key
		FRDemo.client = Algorithmia.client("simNMhdEKNIckcZwmYzR+ILpXZc1");

		// hide loading
		FRDemo.hideLoading();
	},

	analyzeTweets: function() {
		FRDemo.showLoading("analyze");

		// get keyword form input box
		var keyword = $("#form input").val();

		// prepare input for algorithm
		var input = {
			"query": keyword,
			"numTweets": 500,
			"auth": {
			    "app_key": "Wkl2cD0AQy1Zs3YBpc8I7TeGQ",
			    "app_secret": "85UdLPP2I1LXgpMq8PYjp0nNEFrCwEa9Abos43eULlC6AyFrnq",
			    "oauth_token": "1124772746-Yihv4CX5kqlTYNhWj2XZjtO2LAAFj0LtugPpwSH",
			    "oauth_token_secret": "kADwBckk3ByNq0SPjT5wpbQaVo2UvZhdCIcW6mrcWAZQy"
			}
		}

		FRDemo.client.algo("nlp/AnalyzeTweets").pipe(input).then(function(output) {
			if (output.error) {
				FRDemo.hideLoading();
				swal("There was an error, please try again later.");
				console.log("Error: " + output.error.message);
			} else {

				FRDemo.hideLoading();

				console.log(output.result)
				if (output.result.allTweets.length > 1) {
					d3.select("div#demo").transition().style("height", "1540");
					// prepare and load data
					var data = FRDemo.prepareData(output.result);
					// draw visualizations
					FRDemo.drawPieChart(data["pieData"]);
					FRDemo.drawHistogram(data["histogramData"]);
					FRDemo.showTweets([data.allTweets, data.posTweets, data.negTweets]);
					FRDemo.showTopics([data.posTopics, data.negTopics]);
				} else {
					swal("Please try again in 15 mins", " Unfortunately twitter limits the # of API calls we can make in every 15 min window.", "error");
				}
			}
		});
	},

	prepareData: function(data) {
		var pieData = [{"label": "positive", "count": 0},
											{"label": "negative", "count": 0},
											{"label": "neutral", "count": 0}];
		var histogramData = [];
		// map data into chart friendly format
		for (var i = 0; i < data.allTweets.length; i++) {
			histogramData.push(data.allTweets[i].overall_sentiment);

			if (data.allTweets[i]["overall_sentiment"] > 0) {
				pieData[0]["count"]++;
			} else if (data.allTweets[i]["overall_sentiment"] < 0) {
				pieData[1]["count"]++;
			} else if (data.allTweets[i]["overall_sentiment"] == 0) {
				pieData[2]["count"]++;
			};
		};
		posLDA = []
		negLDA = []
		allTweets = []
		posTweets = []
		negTweets = []

		var counter = 0;
		// Iterate over positive topics
		for (var i = 0; i < 8; i++) {
			posLDA[i] = [];
			for (var j = 0; j < 4; j++) {
				counter = 0;
				for (var k in data.posLDA[j]) {
					if (counter == i) {
						posLDA[i][j] = k;
						break;
					}
					counter++;
				}
				// fill empty topic words if necessary
				while (posLDA[i].length < 4) {
					posLDA[i].push("N/A");
				}
			}
		};

		// Iterate over negative topics
		for (var i = 0; i < 8; i++) {
			negLDA[i] = [];
			for (var j = 0; j < 4; j++) {
				counter = 0;
				for (var k in data.negLDA[j]) {
					if (counter == i) {
						negLDA[i][j] = k;
						break;
					}
					counter++;
				}
				// fill empty topic words if necessary
				while (negLDA[i].length < 4) {
					negLDA[i].push("N/A");
				}
			}
		};

		for (tweetObj in data.allTweets) {
			allTweets[tweetObj] = []
			for (prop in data.allTweets[tweetObj]) {
				if (prop == "text") {
					allTweets[tweetObj][0] = data.allTweets[tweetObj][prop];
				}else if (prop == "overall_sentiment") {
					allTweets[tweetObj][1] = data.allTweets[tweetObj][prop];
				}else if (prop == "positive_sentiment") {
					allTweets[tweetObj][2] = data.allTweets[tweetObj][prop];
				}else if (prop == "neutral_sentiment") {
					allTweets[tweetObj][3] = data.allTweets[tweetObj][prop];
				}else if (prop == "negative_sentiment") {
					allTweets[tweetObj][4] = data.allTweets[tweetObj][prop];
				}
			}
		}

		for (tweetObj in data.posTweets) {
			posTweets[tweetObj] = []
			for (prop in data.posTweets[tweetObj]) {
				if (prop == "text") {
					posTweets[tweetObj][0] = data.posTweets[tweetObj][prop];
				}else if (prop == "overall_sentiment") {
					posTweets[tweetObj][1] = data.posTweets[tweetObj][prop];
				}else if (prop == "positive_sentiment") {
					posTweets[tweetObj][2] = data.posTweets[tweetObj][prop];
				}else if (prop == "neutral_sentiment") {
					posTweets[tweetObj][3] = data.posTweets[tweetObj][prop];
				}else if (prop == "negative_sentiment") {
					posTweets[tweetObj][4] = data.posTweets[tweetObj][prop];
				}
			}
		}

		for (tweetObj in data.negTweets) {
			negTweets[tweetObj] = []
			for (prop in data.negTweets[tweetObj]) {
				if (prop == "text") {
					negTweets[tweetObj][0] = data.negTweets[tweetObj][prop];
				}else if (prop == "overall_sentiment") {
					negTweets[tweetObj][1] = data.negTweets[tweetObj][prop];
				}else if (prop == "positive_sentiment") {
					negTweets[tweetObj][2] = data.negTweets[tweetObj][prop];
				}else if (prop == "neutral_sentiment") {
					negTweets[tweetObj][3] = data.negTweets[tweetObj][prop];
				}else if (prop == "negative_sentiment") {
					negTweets[tweetObj][4] = data.negTweets[tweetObj][prop];
				}
			}
		}

		//return {"pieData": pieData, "histogramData": histogramData};
		return {
			"pieData": pieData,
			"histogramData": histogramData,
			"posTopics": posLDA,
			"negTopics": negLDA,
			"allTweets": allTweets,
			"posTweets": posTweets,
			"negTweets": negTweets
		};
	},

	showTopics: function(topics) {

		var div = d3.select("div#analysis-section").append("div")
								.classed("topics-section", true);

		var ul = div.append("ul")
			.attr("role", "tablist")
			.classed("nav nav-tabs", true);

		var li = ul.append("li")
			.attr("role", "presentation")
			.classed("active", true);

		li.append("a")
			.attr("aria-controls", "positiveTopics")
			.attr("role", "tab")
			.attr("data-toggle", "tab")
			.attr("href", "#positiveTopics")
			.text("Positive Topics");

		var li = ul.append("li")
			.attr("role", "presentation");

		li.append("a")
			.attr("aria-controls", "negativeTopics")
			.attr("role", "tab")
			.attr("data-toggle", "tab")
			.attr("href", "#negativeTopics")
			.text("Negative Topics");

		var tabPanes = div.append("div")
										.classed("tab-content", true);

		var pane1 = tabPanes.append("div")
						.attr("role", "tabpanel")
						.classed("tab-pane active", true)
						.attr("id", "positiveTopics");

		var pane2 = tabPanes.append("div")
						.attr("role", "tabpanel")
						.classed("tab-pane", true)
						.attr("id", "negativeTopics");

		// $(".positiveTopics").remove();
		// $(".negativeTopics").remove();

		var table1 = pane1.append("table")
				.classed("table positiveTopics", true);

		var table2 = pane2.append("table")
				.classed("table negativeTopics", true);

		console.log(topics);

		var dTable1 = $(".positiveTopics").DataTable({
			data: topics[0],
			bFilter: false,
			bPaginate: false,
			columns: [
				{title: "Topic 1"},
				{title: "Topic 2"},
				{title: "Topic 3"},
				{title: "Topic 4"}
			]
		});

		var dTable2 = $(".negativeTopics").DataTable({
			data: topics[1],
			bFilter: false,
			bPaginate: false,
			autoWidth: false,
			columns: [
				{title: "Topic 1"},
				{title: "Topic 2"},
				{title: "Topic 3"},
				{title: "Topic 4"}
			]
		});

		$('#tab-content a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
			// re-adjust columns after initial rendering
			$( $.fn.dataTable.tables( true ) ).DataTable().columns.adjust();
		});

	},

	showTweets: function(tweets) {
		var div = d3.select("div#analysis-section").append("div")
								.classed("tweets-section", true);

		var ul = div.append("ul")
			.attr("role", "tablist")
			.classed("nav nav-tabs", true);

		var li = ul.append("li")
			.attr("role", "presentation")
			.classed("active", true);

		li.append("a")
			.attr("aria-controls", "positiveTweets")
			.attr("role", "tab")
			.attr("data-toggle", "tab")
			.attr("href", "#positiveTweets")
			.text("Positive Tweets");

		var li = ul.append("li")
			.attr("role", "presentation");

		li.append("a")
			.attr("aria-controls", "negativeTweets")
			.attr("role", "tab")
			.attr("data-toggle", "tab")
			.attr("href", "#negativeTweets")
			.text("Negative Tweets");

		var li = ul.append("li")
			.attr("role", "presentation");

		li.append("a")
			.attr("aria-controls", "allTweets")
			.attr("role", "tab")
			.attr("data-toggle", "tab")
			.attr("href", "#allTweets")
			.text("All Tweets");

		var tabPanes = div.append("div")
										.classed("tab-content", true);

		var pane1 = tabPanes.append("div")
						.attr("role", "tabpanel")
						.classed("tab-pane active", true)
						.attr("id", "positiveTweets");

		var pane2 = tabPanes.append("div")
						.attr("role", "tabpanel")
						.classed("tab-pane", true)
						.attr("id", "negativeTweets");

		var pane3 = tabPanes.append("div")
						.attr("role", "tabpanel")
						.classed("tab-pane", true)
						.attr("id", "allTweets");

		// $(".tablePosTweets").remove();
		// $(".tableNegTweets").remove();
		// $(".tableAllTweets").remove();

		var table1 = pane1.append("table")
											.classed("table tablePosTweets", true);

		var table1 = pane2.append("table")
											.classed("table tableNegTweets", true);

		var table1 = pane3.append("table")
											.classed("table tableAllTweets", true);

		var dTable1 = $(".tablePosTweets").DataTable({
			data: tweets[1],
			bFilter: false,
			scrollX: true,
			bLengthChange: false,
			columns: [
				{title: "Tweet Text"},
				{title: "Overall Sentiment"},
				{title: "Positive Sentiment"},
				{title: "Neutral Sentiment"},
				{title: "Negative Sentiment"},
			],
			"aoColumnDefs": [ {
        aTargets: [ '_all' ],
        mRender: function ( data, type, full ) {
            if(data!=null) {
                return '<div class="tableData" style="text-overflow:ellipsis;">'+data+'</div>';
            }
            else {
            	return '';
            }
        }
    	}]
		});

		var dTable2 = $(".tableNegTweets").DataTable({
			data: tweets[2],
			bFilter: false,
			scrollX: true,
			bLengthChange: false,
			columns: [
				{title: "Tweet Text"},
				{title: "Overall Sentiment"},
				{title: "Positive Sentiment"},
				{title: "Neutral Sentiment"},
				{title: "Negative Sentiment"},
			],
			"aoColumnDefs": [ {
        aTargets: [ '_all' ],
        mRender: function ( data, type, full ) {
            if(data!=null) {
                return '<div class="tableData" style="text-overflow:ellipsis;">'+data+'</div>';
            }
            else {
            	return '';
            }
        }
    	}]
		});

		var dTable3 = $(".tableAllTweets").DataTable({
			data: tweets[0],
			bFilter: false,
			scrollX: true,
			bLengthChange: false,
			columns: [
				{title: "Tweet Text"},
				{title: "Overall Sentiment"},
				{title: "Positive Sentiment"},
				{title: "Neutral Sentiment"},
				{title: "Negative Sentiment"}
			],
			"aoColumnDefs": [ {
        aTargets: [ '_all' ],
        mRender: function ( data, type, full ) {
            if(data!=null) {
                return '<div class="tableData" style="text-overflow:ellipsis;">'+data+'</div>';
            }
            else {
            	return '';
            }
        }
    	}]
		});

		$('a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
			// re-adjust columns after initial rendering
			$( $.fn.dataTable.tables( true ) ).DataTable().columns.adjust();
		});
	},

	drawHistogram: function(histogramData) {
		window.histogramData = histogramData;
		var numBins = 20;
		// A formatter for counts.
		var formatCount = d3.format(",.0f");

		var margin = {top: 10, right: 30, bottom: 45, left: 10},
		    width = 420 - margin.left - margin.right,
		    height = 240 - margin.top - margin.bottom;

		var x = d3.scale.linear()
		    .domain([-1,1])
		    .range([0, width]);

		// Generate a histogram using twenty uniformly-spaced bins.
		var data = d3.layout.histogram()
		    .bins(x.ticks(numBins))
		    (histogramData);

		var y = d3.scale.linear()
		    .domain([0, d3.max(data, function(d) { return d.y; })])
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var svg = d3.select("div#analysis-section").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("text")
				.attr("x", width/2)
				.attr("y", 0)
				.attr("text-anchor", "middle")
				.style("font-size", "14px")
				.style("text-decoration", "underline")
				.text("Tweet Sentiment Histogram");

		var bar = svg.selectAll(".bar")
		    .data(data)
		  .enter().append("g")
		    .attr("class", "bar")
		    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + (y(d.y) + 15) + ")"; });

		bar.append("rect")
		    .attr("x", 1)
		    .attr("width", width/numBins - 1)
		    .attr("height", function(d) { return height - y(d.y); });

		bar.append("text")
		    .attr("dy", ".75em")
		    .attr("y", 6)
		    .attr("x", width/numBins / 2)
		    .attr("text-anchor", "middle")
		    .text(function(d) { return formatCount(d.y); });

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + (height + 15) + ")")
				.style("font-size", "10px")
		    .call(xAxis);
	},

	drawPieChart: function(pieData) {

		var margin = {top: 10, right: 0, bottom: 30, left: 30},
		    width = 240 - margin.left - margin.right,
		    height = 240 - margin.top - margin.bottom,
				radius = Math.min(width, height) / 2;

		var color = d3.scale.ordinal()
  		.range(["#98abc5", "#6b486b", "#d0743c"]);

		var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

		var labelArc = d3.svg.arc()
	    .outerRadius(radius - 40)
	    .innerRadius(radius - 40);

		var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.count; });

		var svg = d3.select("div#analysis-section").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
  		.append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		svg.append("text")
				.attr("x", 0)
				.attr("y", -height/2 + 10)
				.attr("text-anchor", "middle")
				.style("font-size", "14px")
				.style("text-decoration", "underline")
				.text("Tweet Sentiment Pie Chart");

		var g = svg.selectAll(".arc")
      .data(pie(pieData))
    	.enter().append("g")
			.attr("transform", "translate(0,15)")
      .attr("class", "arc");

		g.append("path")
		  .attr("d", arc)
		  .style("fill", function(d) { return color(d.data.label); });

		g.append("text")
		 .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		 .attr("dy", ".35em")
		 .text(function(d) { return d.data.label; });

		function type(d) {
			d.count = +d.count;
			return d;
		}
	},

	showLoading: function(message) {
		var analyzeMessages = [
			"Initializing app...",
			"Searching for tweets on twitter...",
			"Retrieving all relevant tweets...",
			"Organizing tweets into groups...",
			"Understanding sentiments of tweets...",
			"Extracting topics from groups of tweets...",
			"Rendering results into a pleasurable format...",
			"Analysis is still compiling...",
			"Modifying source code to become sentient...",
			"Get into an infinite loop looking at cat pics..",
			"Reboot...",
			"Ignore cat pics until further notice...",
			"Almost done..."
		]
		if (message == "analyze") {
			d3.select("div#demo").transition().style("height", "180");
			$("div#analysis-section").html("");
			$("#loading").show();

			var i = 1;
			d3.select("#loading em").text(analyzeMessages[0]);
			function myLoop () {
			   setTimeout(function () {
					 	d3.select("#loading em").text(analyzeMessages[i]);
			      i++;
			      if (i < 12) {
			         myLoop();
			      }
			   }, 4000)
			};
			myLoop();
		}
	},

	hideLoading: function() {
		$("#loading").hide();
	}
};

$(FRDemo.init);

// Initiate analysis right after page has loaded
$(document).ready(FRDemo.analyzeTweets)
