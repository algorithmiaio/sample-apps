# Video Search

## Use Computer Vision and Deep Learning to search untagged video

This is a demo of Algorithmia's [VideoMetadataExtraction](https://algorithmia.com/algorithms/media/VideoMetadataExtraction) and [InceptionNet](https://algorithmia.com/algorithms/deeplearning/InceptionNet) algorithms.  It examines each frame of several videos, autogenerates tags based on their visual content, and makes it possible to search through the videos to find the timepoints at which that tag occurs.  For example, a user can search for "chair" and see all videos, and the specific points in time in those videos, where a chair is visible.

## See this demo in action

This demo can be viewed at [https://demos.algorithmia.com/video-search/](https://demos.algorithmia.com/video-search/)

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/video-search/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples)) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:video-search`
6. open **/build/video-search/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
