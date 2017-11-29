// this API Key will only work on Algorithmia's website; get your own key at https://algorithmia.com/user#credentials
var apiKey = "simS8vo8pYJJkQRQNhm2MYFfYke1";

var AmazonMiner =
{
	loading: null,
	products: null,
	features: null,
	legend: null,
	analysis: null,
	view: "chart",
	colors: ["#f1c40f","#9b59b6","#e67e22", "#2ecc71", "#e74c3c", "#3498db"],

	init: function()
	{
		// bind DOM
		AmazonMiner.loading = $("#loading");
		AmazonMiner.products = $("#products");
		AmazonMiner.features = $("#features");
		AmazonMiner.legend = $("#legend");
		AmazonMiner.chart = $("#chart");

		// bind text boxes change
		AmazonMiner.products.keyup(AmazonMiner.configurationChanged);
		AmazonMiner.features.keyup(AmazonMiner.configurationChanged);

		// bind buttons
		$("#submit").click(AmazonMiner.analyze);
		$("#view-mode span:first").click(AmazonMiner.showChartView);
		$("#view-mode span:last").click(AmazonMiner.showTextView);

		// initialize configurator
		Configurator.init();
	},

	analyze: function()
	{
		AmazonMiner.loading.show();
		
		// fake response? used for UI testing
		//$.get("/fake_data.json", AmazonMiner.process); AmazonMiner.loading.hide(); return;

    var client = Algorithmia.client(apiKey);
		var input = AmazonMiner.getInputForm();

		client.algo("ANaimi/AmazonReviewFeatureAnalysis").pipe(input).then(function(output) {
			// TODO: hide loading
			AmazonMiner.loading.hide();
			if(output.error) return alert("error: " + output.error.message);
			AmazonMiner.process(output.result);
		});
	},

	getInputForm: function()
	{
		var input = {"products": [], "features": []};

		// products
		var lines = AmazonMiner.products.val().trim().replace(/ /g, "").split("\n");
		_.each(lines, function(line) {
			var tokens = line.split(",");
			input["products"].push({"name": tokens[0], "url": tokens[1]});
		});

		// features
		input["features"] = AmazonMiner.features.val().replace(/ /g, "").split(",");

		return input;
	},

	process: function(result)
	{
		// save it
		AmazonMiner.analysis = result;
		AmazonMiner.makeLegend();
		AmazonMiner.render();
	},

	render: function()
	{
		if (AmazonMiner.view == "chart")
		{
			AmazonMiner.showChartView();
		}
		else
		{
			AmazonMiner.showTextView();
		}
	},

	configurationChanged: function()
	{
		$("#submit").addClass("visible");
	},

	makeLegend: function()
	{
		var colorIndex = 0;

		$("#legend-container").show();
		AmazonMiner.legend.html("");

		_.each(AmazonMiner.analysis, function(prod, index) {
			
			var button = $("<span data-prod-id='" + index + "'>" + prod.name + "</span>");
			button.click(AmazonMiner.toggleProduct);

			var color = AmazonMiner.colors[colorIndex++ % AmazonMiner.colors.length];
			button.css("background-color", color);

			AmazonMiner.legend.append(button);

		});
	},

	toggleProduct: function()
	{
		var button = $(this);
		button.toggleClass("disabled");

		var id = button.attr("data-prod-id");
		AmazonMiner.analysis[id].disabled = button.hasClass("disabled");

		AmazonMiner.render();
	},

	showChartView: function()
	{
		AmazonMiner.view = "chart";
		AmazonMiner.chart.html("");
		ChartMaker.render(AmazonMiner.analysis);
	},

	showTextView: function()
	{
		AmazonMiner.view = "text";
		AmazonMiner.chart.html("");

		_.each(AmazonMiner.analysis, function(product, index) {
			if (product.disabled != true)
			{
				AmazonMiner.makeTextRows(product, index);
			}
		});

	},

	makeTextRows: function(product, index)
	{
		var template = $("#comment-template").html().trim();

		_.each(product.features, function(feature) {
			// make header
			AmazonMiner.chart.append("<h2>" + product.name + "/" + feature.name + " <span>average score = " + feature.avg_score + "</span></h2>");

			// make sentences
			_.each(feature.sentences, function(sentence, i) {
				var score = feature.scores[i];
				var color = AmazonMiner.getScoreColor(score);
				var row = $(Mustache.render(template, {score: score, color: color, body: sentence}));
				AmazonMiner.chart.append(row);
			});
		});
	},

	getScoreColor: function(score)
	{
		// This is a quick and dirty way of doing it - get over it.

		// positive? scale of green
		if (score >= 0)
		{
			var opacity = Math.min(1, score);
			return "rgba(46, 204, 113," + opacity + ")";
		}

		// negative? scale of red
		else
		{
			var opacity = Math.min(1, -1*score);
			return "rgba(231, 76, 60," + opacity + ")";
		}
	}
}

$(AmazonMiner.init);