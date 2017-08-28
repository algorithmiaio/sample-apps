// Configuration helper -- populates the fields with different settings.

var Configurator =
{
	init: function()
	{
		// bind buttons
		$("#defaults a").click(Configurator.setConfiguration);


		// default to cameras
		Configurator.setConfiguration("cameras");
	},

	setConfiguration: function(name)
	{
		// get name of configuration
		if (typeof name != "string")
		{
			var name = $(this).attr("data-name");
		}

		// apply it
		Configurator[name].apply();

		if (name != "customize")
		{
			$("#submit").removeClass("visible");
			AmazonMiner.analyze();
		}

		// update the classes of the buttons
		$("#defaults a").removeClass("active");
		$("#defaults a[data-name='" + name + "']").addClass("active");
	},

	cameras: function()
	{
		var products = "\
		Nikon, http://www.amazon.com/Nikon-Coolpix-Digital-Camera-Black/dp/B00THKEKEQ/\n\
		Sony, http://www.amazon.com/Sony-DSCW800-Digital-Camera-Black/dp/B00I8BIBCW/\n\
		Canon, http://www.amazon.com/Canon-EOS-Rebel-T5-Accessory/dp/B00J34YO92/\n\
		Vivitar, http://www.amazon.com/Vivitar-16-1mp-Camera-Colors-Styles/dp/B004538PLY/\n\
		Polaroid, http://www.amazon.com/Polaroid-Instant-Digital-Printing-Technology/dp/B015JIAD7C/\n\
		Samsung, http://www.amazon.com/Samsung-NX-Mirrorless-Digital-Camera/dp/B00IVEHVR2/\
		".replace(/\t/g,"");
		AmazonMiner.products.val(products);

		AmazonMiner.features.val("zoom, lens, light, battery, price");
	},

	toasters: function()
	{
		var products ="\
		BlackDecker, http://www.amazon.com/BLACK-DECKER-TR1278B-2-Slice-Toaster/dp/B008YS1ZAO/\n\
		Hamilton, http://www.amazon.com/Hamilton-Beach-22811-2-Slice-Toaster/dp/B00CXMO02W/\n\
		Oster, http://www.amazon.com/Oster-TSSTTRWF4S-4-Slice-Toaster/dp/B007JRUSE0/\n\
		Conair, http://www.amazon.com/Cuisinart-CPT-122-2-Slice-Compact-Plastic/dp/B009GQ034C/\
		".replace(/\t/g, "");
		AmazonMiner.products.val(products);

		AmazonMiner.features.val("slots, clean, dials, fast, price");
	},

	shoes: function()
	{
		var products ="\
		Nike, http://www.amazon.com/Nike-Flex-2015-Running-Black/dp/B00K7I0O56/\n\
		Adidas, http://www.amazon.com/adidas-Performance-Galaxy-Elite-Running/dp/B00OANE8R4/\n\
		Rebook, http://www.amazon.com/Reebok-Super-Speed-Running-Black/dp/B00TIYAJWS/\n\
		Puma, http://www.amazon.com/PUMA-Running-Steel-Limoges-White/dp/B00KDJBKHK/\n\
		UnderArmor, http://www.amazon.com/Under-Armour-Micro-Assert-Running/dp/B00ZVCRCIU/\
		".replace(/\t/g, "");
		AmazonMiner.products.val(products);

		AmazonMiner.features.val("comfortable, run, walk, gym, quality, price");
	},

	toilerpaper: function()
	{
		var products ="\
		Quilted, http://www.amazon.com/gp/product/B007UZNS5W/\n\
		Bounty, http://www.amazon.com/gp/product/B019DM86LA/\n\
		AngelSoft, http://www.amazon.com/gp/product/B00FFJ2LXU/\n\
		Cottonelle, http://www.amazon.com/gp/product/B00BV4HEE4/\n\
		".replace(/\t/g, "");
		AmazonMiner.products.val(products);

		AmazonMiner.features.val("size, soft, absorb, quality, price");
	},

	customize: function()
	{
		AmazonMiner.products.val("");
		AmazonMiner.features.val("");
		$("#legend-container").hide();
		AmazonMiner.chart.html("");

		$("#submit").addClass("visible");
	}
}

// Sample input to ANaimi/AmazonReviewFeatureAnalysis
// {
// 	"products": [
// 		{"name": "Nikon", "url": "B00THKEKEQ"},
// 		{"name": "Sony", "url": "B00I8BIBCW"},
// 		{"name": "Canon", "url" : "B00J34YO92"},
// 		{"name": "Vivitar", "url" : "B004538PLY"},
// 		{"name": "Polaroid", "url" : "B015JIAD7C"},
// 		{"name": "Samsung", "url" : "B00IVEHVR2"}
// 	], 
// 	"features": ["lens", "zoom", "battery", "light", "price"]
// }