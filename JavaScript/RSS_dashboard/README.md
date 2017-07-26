# RSS Dashboard

## Extract summaries, tags, and sentiment from an RSS feed

This is a demo of several of Algorithmia's website inspection and text analysis tools, including:
* [Scrape RSS](https://algorithmia.com/algorithms/tags/ScrapeRSS) - parses an RSS feed, extracting each entry's title and url
* [HTML2Text](https://algorithmia.com/algorithms/util/Html2Text) - converts the main content of an HTML page to plain text
* [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer) - creates a summary by extracting topic sentences based on frequency of key terms
* [AutoTag](https://algorithmia.com/algorithms/nlp/AutoTag) - uses a variant of [nlp/LDA](https://algorithmia.com/algorithms/nlp/LDA) to extract keywords.
* [Sentiment Analysis](https://algorithmia.com/algorithms/nlp/SentimentAnalysis) - assigns a sentiment rating from -1 (very negative) to to 1 (very positive).

This tool takes a URL for an RSS feed, and automatically generates tags, text summaries, and sentiment analysis.

## See this demo in action

This demo can be viewed at http://demos.algorithmia.com/rss-dashboard

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/rss-dashboard/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples) w/ 5k credits monthly) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:rss-dashboard`
6. open **/build/rss-dashboard/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
