# Remove NSFW sections from a video using the VideoNudityDetection microservice

The [Video Nudity Detection microservice](https://algorithmia.com/algorithms/sfw/VideoNudityDetection) from Algorithmia is an API which takes in a video (by URL) and detects which time-ranges may contain nudity.

We can make use of this service, along with video-editing libraries, to strip out NSFW content from videos.

For the full blog post related to this recipe, see http://blog.algorithmia.com [TBA].

## Getting Started

Create a free [Algorithmia account](https://algorithmia.com/signup), and install the Algorithmia Python client:

```
pip install algorithmia
```

Next, install the `moviepy` library, which will allow you to edit videos via Python:

```
pip install moviepy
python -c "import imageio; imageio.plugins.ffmpeg.download()"
```

You might also need to hook up `ffmpeg`; simply the following Python script:

```
import imageio
imageio.plugins.ffmpeg.download()
```

Detailed instructions can be found in the [blog post](http://blog.algorithmia.com/) [TBA].

## How To Run the Script

First, edit the script and replace `your_api_key` with your [Algorithmia API Key](http://developers.algorithmia.com/basics/customizing-api-keys/)

Also replace `myfile.mp4` with the local path of a video you'd like to examine, and `output.mp4` with the filepath where output should be written.

Use the command line, and navigate to the folder with your Python file and run:

```
python video-nsfw.py
```

## Notes

You can adjust the value of `threshold` (max: 1) to tweak the nudity-detection sensitivity.

If your system has trouble writing the output file, try replacing `libx264` with a different [codec](https://zulko.github.io/moviepy/ref/VideoClip/VideoClip.html#moviepy.video.VideoClip.VideoClip.write_videofile)

## Built With

* [Algorithmia](https://algorithmia.com)
* [Video Nudity Detection microservice](https://algorithmia.com/algorithms/sfw/VideoNudityDetection)
* [moviepy](https://zulko.github.io/moviepy/install.html)

