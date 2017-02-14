# Categorize your documents by language using Algorithmia's language detector

The [Language Identification microservice](https://algorithmia.com/algorithms/nlp/LanguageIdentification) from Algorithmia is a straightforward API which accepts a piece of text, and attempts to identify the natural language in which it is written.

This simple Python script will examine all the .txt and .docx files in a directory, identify the language of each file, and move them into subdirectories according to their ISO 639 language code ('en', 'fr', etc).

## Getting Started

Create a free [Algorithmia account](https://algorithmia.com/signup), and install the Algorithmia Python client and the python-docx package:

```
pip install algorithmia
pip install python-docx
```

Detailed instructions can be found in the [blog post](http://blog.algorithmia.com/build-your-own-language-detection-microservice/).

## How To Run the Script

First, edit the script and replace `your_api_key` with your [Algorithmia API Key](http://developers.algorithmia.com/basics/customizing-api-keys/)

Also replace `/some/file/path/` with a local directory which you wish to examine.

Use the command line, and navigate to the folder with your Python file and run:

```
python language-detector.py
```

## Built With

* [Algorithmia](https://algorithmia.com)
* [Language Identification](https://algorithmia.com/algorithms/nlp/LanguageIdentification)
* [Python-Docx](https://python-docx.readthedocs.io/en/latest/user/install.html)

