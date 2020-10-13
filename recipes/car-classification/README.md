Video processing pipelines are difficult to set up even if you have access to GPU machines, luckily we did the hard lifting for you and using a user contributed car classification algorithm you can find all the makes and models of cars in your video with a few lines of code.

This recipe uses the [Video Metadata Extraction algorithm](https://algorithmia.com/algorithms/media/VideoMetadataExtraction) and the [Car Make and Model Recognition algorithm](https://algorithmia.com/algorithms/LgoBE/CarMakeandModelRecognition) to find useful information from traffic videos.

For the full blog post related to this recipe, see [Video Processing of Traffic Videos](http://blog.algorithmia.com/video-processing-car-classification)

## Getting Started

Install the Algorithmia client from PyPi:

```pip install algorithmia```

You’ll also need a free Algorithmia account.

Sign up [here](https://algorithmia.com/), and then grab your [API key](algorithmia.com/user#credentials).

Find this line in the script: 

```
client = Algorithmia.client("YOUR_API_KEY")
```
and add in your API key.

## How to Process Videos to Find a Car's Make and Model

After putting in your own API key to the line above run it in your console environment:

```python car_classifier.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [Video Metadata Extraction algorithm](https://algorithmia.com/algorithms/media/VideoMetadataExtraction)
* [Car Make and Model Recognition algorithm](https://algorithmia.com/algorithms/LgoBE/CarMakeandModelRecognition)
