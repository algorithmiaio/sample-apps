# Retrieve data from a public API, then train the Document Classifier to predict keywords for new text samples

Algorithmia's [Document Clasifier](https://algorithmia.com/algorithms/nlp/DocumentClassifier) lets you train it on a set of documents (blocks of text), each associated with a keyword. Once it has been trained, you can then give a new document and it will return a set of predicted keywords. 

For the full blog post related to this recipe, see https://blog.algorithmia.com/acquiring-data-for-document-classification/.

## Getting Started

Create a free [Algorithmia account](https://algorithmia.com/signup), and install the Algorithmia Python client and BeautifulSoup:

```
pip install algorithmia
pip install beautifulsoup4
```

Detailed instructions can be found in the [blog post](https://blog.algorithmia.com/acquiring-data-for-document-classification/).

## How To Run the Script

First, edit the script and replace `your_api_key` with your [Algorithmia API Key](http://developers.algorithmia.com/basics/customizing-api-keys/)

Use the command line, and navigate to the folder with your Python file and run:

```
python document-classification.py
```

This sample used PubMed data, but to go further, modify the script to use a different datasource API or a webpage scraper such as https://algorithmia.com/algorithms/web/HTMLDataExtractor

## Built With

* [Algorithmia](https://algorithmia.com)
* [Document Classification microservice](https://algorithmia.com/algorithms/nlp/DocumentClassifier)

