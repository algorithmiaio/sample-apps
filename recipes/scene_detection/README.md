# Extract Metadata from Scenes in a Video

Extracting metadata from videos is often needed for video editing, YouTube advertisement placement and other activities, yet it's not easy to simply find where one scene ends and another begins.

Earlier this week we wrote a [blog post](http://blog.algorithmia.com/automatic-scene-detection/) about an algorithm that does this for you called [Scene Detection] (https://algorithmia.com/algorithms/media/SceneDetection). 

For the full blog post related to this recipe, see [Video Editing: extracting metadata from movie scenes](https://blog.algorithmia.com/video-editing-extracting-metadata-from-movie-scenes/).

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

## How to Find the Scenes in Videos

After putting in your own API key to the line above run it in your console environment:

```python scene_detection.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [Scene Detection](https://algorithmia.com/algorithms/media/SceneDetection)
* [Hosted Data](https://algorithmia.com/developers/data/hosted/)
