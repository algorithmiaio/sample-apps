# Video Metadata

## Get image recommendations based on text content

This is a demo of Algorithmia's [Document Classifier](https://algorithmia.com/algorithms/nlp/DocumentClassifier)

Further reading:
* [Train a Machine to Turn Documents into Keywords via Document Classification](https://blog.algorithmia.com/train-machine-documents-into-keywords/)
* [Acquiring Data for Document Classification](https://blog.algorithmia.com/acquiring-data-for-document-classification)

## See this demo in action

This demo can be viewed at [https://demos.algorithmia.com/doc-classifier/](https://demos.algorithmia.com/doc-classifier/)

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/doc-classifier/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=socialimagerec)) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:doc-classifier`
6. open **/build/doc-classifier/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
