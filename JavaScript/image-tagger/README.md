# Image Tagging

## Use Deep Learning to Identify Features in an Image

This is a demo of the [IllustrationTagger](https://algorithmia.com/algorithms/deeplearning/IllustrationTagger) running on Algorithmia, which uses state-of-the-art deep learning to identify places in images.  Simply provide an image, and state-of-the-art deep learning will identify features which are present.

## See this demo in action

This demo can be viewed at https://demos.algorithmia.com/image-tagger

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/image-tagger/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples)) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:image-tagger`
6. open **/build/image-tagger/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
