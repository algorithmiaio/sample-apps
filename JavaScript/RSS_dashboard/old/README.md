# RSS Dashboard

This is a sample project called RSS Dashboard that demonstrates how to combine different algorithms for use on and with the web. 

This sample app is essentially a "smart RSS" feed. We use 5 different algorithms to create a feed that scrapes the most recent content from your website of choice, then we extract the HTML. Following this, we use NLP algorithms to tag the entries with relevant keywords, summarize the post into a preview paragraph, and generate a sentiment score to be displayed in the feed.

The algorithms we are using are:
* [Scrape RSS](https://algorithmia.com/algorithms/tags/ScrapeRSS)
* [HTML 2 Text](https://algorithmia.com/algorithms/util/Html2Text)
* [Autotag](https://algorithmia.com/algorithms/nlp/AutoTag)
* [Sentiment Analysis](https://algorithmia.com/algorithms/nlp/SentimentAnalysis)
* [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer)

You can see a live version of this demo at [RSS Dashboard](https://algorithmia.com/demo/rss).

This project includes two portions: the workshop code that is intended for use in our ["Leveraging Powerful Algorithms" Workshop](https://generalassemb.ly/education/leveraging-powerful-algorithms) and the completed code section that has fully functional demo code. Please see the respective READMEs in each to get up and running.