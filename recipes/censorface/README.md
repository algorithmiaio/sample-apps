# Create and Censor Non-Nude Subclips from Video

Video editing is a complicated process and when you need a family-friendly censored video pipeline, we are here to help. In past blog articles we've covered [Nudity Detection](https://blog.algorithmia.com/improving-nudity-detection-nsfw-image-recognition/), [Video Metadata Extraction](https://blog.algorithmia.com/introduction-video-metadata/), and [Video Transform](https://blog.algorithmia.com/introduction-to-video-transform/) which are all a part of this recipe so go ahead and check them out!

Earlier this week we wrote a [blog post](https://blog.algorithmia.com/censoring-faces-automatically/) about an algorithm that censors faces for you called [Censorface](https://algorithmia.com/algorithms/cv/CensorFace) which we'll also cover using this recipe. 

For the full blog post related to this recipe, see [How to Censor Faces with Video Processing Algorithms](https://blog.algorithmia.com/censor-faces-with-video-processing-algorithms/).

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

## How to Create a Video Pipeline to Censor Video Subclips

After putting in your own API key to the line above run it in your console environment:

```python censorface_videos.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [Censorface](https://algorithmia.com/algorithms/cv/CensorFace)
* [Hosted Data](https://algorithmia.com/developers/data/hosted/)
* [Scene Detection](https://algorithmia.com/algorithms/media/SceneDetection)
* [Video Metadata Extraction](https://algorithmia.com/algorithms/media/VideoMetadataExtraction)
* [Nudity Detection](https://algorithmia.com/algorithms/sfw/NudityDetection)
* [Video Transform](https://algorithmia.com/algorithms/media/VideoTransform)
