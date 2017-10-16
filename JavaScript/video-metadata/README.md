# Video Metadata

## Applying machine learning algorithms to extract information from videos

This is a demo of Algorithmia's [VideoMetadataExtraction](https://algorithmia.com/algorithms/media/VideoMetadataExtraction) and associated algorithms.  It uses machine learning algorithms such as [NudityDetection](https://algorithmia.com/algorithms/sfw/NudityDetectioni2v), [CarMakeandModelRecognition](https://algorithmia.com/algorithms/LgoBE/CarMakeandModelRecognition), and [EmotionRecognition](https://algorithmia.com/algorithms/deeplearning/EmotionRecognitionCNNMBP) to examine the content of frame of a video. 

## See this demo in action

This demo can be viewed at [https://demos.algorithmia.com/video-metadata/](https://demos.algorithmia.com/video-metadata/)

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/video-metadata/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples) w/ 5k credits monthly) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:video-metadata`
6. open **/build/video-metadata/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
