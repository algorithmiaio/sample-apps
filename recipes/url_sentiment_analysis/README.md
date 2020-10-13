# Build a Sentiment Analysis Pipeline for Web Scraping

While sometimes text content is easily retrieved through a database query, other times it’s not so simple to extract. For instance, it’s notoriously difficult to retrieve text content from websites, especially when you don’t want to extract everything from a URL —  just the text content of specific pages.

For example, if you want to derive the sentiment from specific pages on a website, you can easily spend hours finding an appropriate web scraper, and then weeks labeling data and training a model for sentiment analysis.

This code snippet shows how to use Algorithmia to grab all the links from a web page, extracts the text content from each URL, and then returns the sentiment of each page.

For the full blog post related to this recipe, see [Building a Sentiment Analysis Pipeline for Web Scraping](http://blog.algorithmia.com/sentiment-analysis-pipeline-for-web-scraping/).

## Getting Started

Install the Algorithmia client from PyPi:

```pip install algorithmia```

You’ll also need a free Algorithmia account.

Sign up [here](https://algorithmia.com/), and then grab your [API key](algorithmia.com/user#credentials).

Find this line in the script: 

```
client = Algorithmia.client("YOUR_API_KEY")
```
and add in your API key.

## How to Find the Sentiment Analysis of your URL

After putting in your own API key to the line above run it in your console environment:

```python sentiment_analysis.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [Get Links](https://algorithmia.com/algorithms/web/GetLinks)
* [URL To Text](https://algorithmia.com/algorithms/util/Url2Text)
* [Sentiment Analysis](https://algorithmia.com/algorithms/nlp/SentimentAnalysis)

