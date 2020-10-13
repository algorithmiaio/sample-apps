# Retrieve Tweets By Keyword and Find Named Entities

This script will call the Twitter API for keyword related Tweets, clean the data using regex, and then run it through named entity recognition. 

With the output we get from the algorithm the data will then be grouped by the category each named entity is assigned to, and then extract the categories we are interested in.

For the full blog post related to this recipe, see [How to Retrieve Tweets By Keyword and Identify Named Entities](http://blog.algorithmia.com/text-mining-tweets-named-entity-recognition/).

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

## How to Extract Keyword Tweets and Find Noun Phrases

After putting in your own API key to the line above run it in your console environment:

```python twitter_named_entity_recognition.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [Retrieve Tweets With Keyword](https://algorithmia.com/algorithms/diego/RetrieveTweetsWithKeyword)
* [Named Entity Recognition](https://algorithmia.com/algorithms/StanfordNLP/NamedEntityRecognition)
