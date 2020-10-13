# Is it Nude?

## Using artificial intelligence to detect nudity

This is a demo of the [NudityDetectioni2v](https://algorithmia.com/algorithms/sfw/NudityDetectioni2v) microservice running on Algorithmia, which uses state-of-the-art deep learning to identify places in images.  Simply provide an image, and it will detect whether nudity is present.

## See this demo in action

This demo can be viewed at https://demos.algorithmia.com/isitnude

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/isitnude/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples)) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:isitnude`
6. open **/build/isitnude/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
