# Web Page Inspector

## An API to instantly retrieve clean, structured data from any URL

This is a demo of several of Algorithmia's webpage inspection and text analysis tools, including:
* [Analyze URL](https://algorithmia.com/algorithms/web/AnalyzeURL) - takes a URL and returns several pieces of structured data
* [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer) - creates a summary of the most important points of the original document
* [Social Sentiment Analysis](https://algorithmia.com/algorithms/nlp/SocialSentimentAnalysis) - assigns sentiment ratings of "positive", "negative" and "neutral"
* [Count Social Shares](https://algorithmia.com/algorithms/web/ShareCounts) - returns the number of times that URL has been shared on various social media sites
* [Get Links](https://algorithmia.com/algorithms/web/GetLinks) - scrapes the page for all the links and returns them as URL strings
* [Get Image Links](https://algorithmia.com/algorithms/diego/Getimagelinks) - return a list of all the image URLs
* [Auto-Tag URL](https://algorithmia.com/algorithms/tags/AutoTagURL) - produces candidate tags using LDA

With this demo, one can instantly examine a webpage, summarize the content and sentiment of each page, see suggested tags, and count social shares.

## See this demo in action

This demo can be viewed at http://demos.algorithmia.com/web-page-inspector

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples) w/ 5k credits monthly) in the line containing "Algorithmia.client()"
3. open **index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
