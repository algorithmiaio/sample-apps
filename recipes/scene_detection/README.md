# Extract Metadata from Scenes in a Video

Extracting metadata from videos is often needed for video editing, YouTube advertisement placement and other activities, yet it's not easy to simply find where one scene ends and another begins.

Earlier this week we wrote a [blog post](http://blog.algorithmia.com/automatic-scene-detection/) about an algorithm that does this for you called [Scene Detection] (https://algorithmia.com/algorithms/media/SceneDetection). 

For the full blog post related to this recipe, see [Video Editing: extracting metadata from movie scenes](http://blog.algorithmia.com/scene-detection-in-videos-extracting-metadata-from-movie-scene).

## Getting Started

Install the Algorithmia client from PyPi:

```pip install algorithmia```

You’ll also need a free Algorithmia account, which includes 5,000 free credits a month – more than enough to get started with scene detection in videos.

Sign up [here](https://algorithmia.com/), and then grab your [API key](algorithmia.com/user#credentials).

Find this line in the script: 

```
client = Algorithmia.client("YOUR_API_KEY")
```
and add in your API key.

## How to Classify Documents with LDA

After putting in your own API key to the line above run it in your console environment:

```python scene_detection.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [Scene Detection](https://algorithmia.com/algorithms/media/SceneDetection)
* [Hosted Data](https://algorithmia.com/developers/data/hosted/)
