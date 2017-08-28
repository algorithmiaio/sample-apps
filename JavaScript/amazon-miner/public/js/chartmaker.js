// Chart Helper
var ChartMaker =
{
	render: function(analysis)
	{
		// options
		var options = {
			w: 300,
			h: 280,
			margin: {top: 60, right: 100, bottom: 50, left: 135},
			maxValue: 1,
			levels: 5,
			dotRadius: 10,
			roundStrokes: true,
			color: d3.scale.ordinal().range(ChartMaker.getEnabledColors(analysis))
		};

		// data
		var data = ChartMaker.getDataFromAnalysis(analysis);

		// do it!
		RadarChart("#chart", data, options);
	},

	getEnabledColors: function(analysis)
	{
		var colors = [];

		_.each(analysis, function(product, index) {
			if (product.disabled != true) // because it could be null
			{
				colors.push(AmazonMiner.colors[index % AmazonMiner.colors.length]);
			}
		});

		return colors;
	},

	getDataFromAnalysis: function(analysis)
	{
		var data = [];

		_.each(analysis, function(product) {
			if (product.disabled != true)
			{
				var part = [];

				_.each(product.features, function(feature) {
					part.push({axis: feature.name, value: feature.avg_score});
				});

				data.push(part);
			}
			
		});

		return data;
	}
}