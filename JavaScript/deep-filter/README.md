# Deep Style

## Use Deep Learning for Artistic Style Transfer

This is a demo of Algorithmia's [DeepFilter](https://algorithmia.com/algorithms/deeplearning/DeepFilter) implementation.  Simply provide an image, and deep learning will automatically stylize it in a number of different ways.  You can also train your own filters as described in the [tutorial](http://blog.algorithmia.com/training-style-transfer-models/?ref=ghsamples).

## See this demo in action

This demo can be viewed at https://demos.algorithmia.com/deep-style

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/video-metadata/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples)) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:video-metadata`
6. open **/build/video-metadata/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
