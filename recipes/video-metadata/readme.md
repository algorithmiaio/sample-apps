# Extract information from each frame of your video with the Video Metadata Extraction microservice

The [Video Metadata Extraction microservice](https://algorithmia.com/algorithms/media/VideoMetadataExtraction) from Algorithmia is a straightforward API which takes in a video (by URL) and returns metadata, such as a list of object tags, for each frame of the video.

For the full blog post related to this recipe, see http://blog.algorithmia.com [TBA].

## Getting Started

Create a free [Algorithmia account](https://algorithmia.com/signup), and install the Algorithmia Python client:

```
pip install algorithmia
```

Detailed instructions can be found in the [blog post](http://blog.algorithmia.com/) [TBA].

## How To Run the Script

First, edit the script and replace `your_api_key` with your [Algorithmia API Key](http://developers.algorithmia.com/basics/customizing-api-keys/)

Also replace `http://example.com/somevideo.mpg` with the URL of a video you'd like to examine.

Use the command line, and navigate to the folder with your Python file and run:

```
python video-metadata.py
```

## Built With

* [Algorithmia](https://algorithmia.com)
* [Video Metadata Extraction microservice](https://algorithmia.com/algorithms/media/VideoMetadataExtraction)

