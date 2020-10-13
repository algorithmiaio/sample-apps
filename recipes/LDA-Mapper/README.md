# Classifying Text Data Using LDA

Finding topics in unstructured text data is a common use case that is easily solved using [LDA](https://algorithmia.com/algorithms/nlp/LDA), a topic modeling algorithm hosted on Algorithmia.

This recipe covers how to use LDA for topic extraction on text documents and then classify new documents to those topics.

For the full blog post related to this recipe, see [Use LDA to Classify Text Documents](http://blog.algorithmia.com/lda-algorithm-classify-text-documents/).

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

## How to Classify Documents with LDA

After putting in your own API key to the line above run it in your console environment:

```python lda.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [LDA](https://algorithmia.com/algorithms/nlp/LDA)
* [LDA Mapper](https://algorithmia.com/algorithms/nlp/LDAMapper)
