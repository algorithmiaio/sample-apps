# Scene Recognition

## Use Deep Learning to Identify and Classify Places

This is a demo of the [Places365Classifier](https://algorithmia.com/algorithms/deeplearning/Places365Classifier) running on Algorithmia, which uses state-of-the-art deep learning to identify places in images.  Simply paste in a URL or upload a file to quickly classify places, locations, and scenes in images.

## See this demo in action

This demo can be viewed at http://demos.algorithmia.com/classify-places

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/classify-places/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples) w/ 5k credits monthly) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:classify-places`
6. open **/build/classify-places/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
