# Site Mapper

## Look at Your Website the Way Google Does

This is a demo of several of Algorithmia's website inspection and text analysis tools, including:
* [Get Links](https://algorithmia.com/algorithms/web/GetLinks) - examines a webpage and returns links to other pages
* [Page Rank](https://algorithmia.com/algorithms/thatguy2048/PageRank) - a simple implementation of the [PageRank algorithm](https://en.wikipedia.org/wiki/PageRank)
* [URL2Text](https://algorithmia.com/algorithms/util/Url2Text) - extracts the main content from a webpage
* [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer) - creates a summary by extracting key topic sentences
* [Auto-Tag](https://algorithmia.com/algorithms/nlp/AutoTag) - generates keywords via Latent Dirichlet Allocation
* [D3](https://d3js.org/) - a JavaScript library for generating graphs and visualizations

With this demo, one can quickly crawl an entire website, rank its pages, summarize and extract tags and sentiment from ech page, and view the sitemap in a D3 force-directed graph.

## See this demo in action

This demo can be viewed at https://demos.algorithmia.com/sitemap

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/sitemap/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples)) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:sitemap`
6. open **/build/sitemap/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
