# Video Toolbox

## Applying machine learning algorithms to transform entire videos

This is a demo of Algorithmia's [VideoTransform](https://algorithmia.com/algorithms/media/VideoTransform) and associated microservices.  It uses an image processing algorithm such as [DeepFilter](https://algorithmia.com/algorithms/deeplearning/DeepFilter), [SalNet](https://algorithmia.com/algorithms/deeplearning/SalNet), or [ColorfulImageColorization](https://algorithmia.com/algorithms/deeplearning/ColorfulImageColorization) to alter each frame of a video, then recombines it back into a freshly transformed video file.

## See this demo in action

This demo can be viewed at [https://demos.algorithmia.com/video-toolbox/](https://demos.algorithmia.com/video-toolbox/)

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/video-toolbox/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples) w/ 5k credits monthly) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:video-toolbox`
6. open **/build/video-toolbox/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
