# Automatic Slideshare Text Summarization

This script will use the [Extract Text](https://algorithmia.com/algorithms/util/ExtractText) algorithm and the [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer) algorithm to show how to scrape and summarize the text from a SlideShare presentation.
For the full blog post related to this recipe, see [Automatic Slideshare Text Summarization](http://blog.algorithmia.com/automatic-slideshare-text-summarization/).

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

```python summarizer.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [Extract Text](https://algorithmia.com/algorithms/util/ExtractText)
* [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer)
