# Auto-level your photos with help from Algorithmia's horizon detector

The [Horizon Detection microservice](https://algorithmia.com/algorithms/ukyvision/deephorizon) from Algorithmia is an easy-to-use API which takes an image (URL or base64-encoded file) and attempts to find the horizon.

This Python script allows you to specify an input image, passes it through the horizon-detection service, and straightens out the image (while optionally cropping and resampling it).

For the full blog post related to this recipe, see [blog.algorithmia.com](http://blog.algorithmia.com/).

## Getting Started

Create a free [Algorithmia account](https://algorithmia.com/signup), and install the Algorithmia Python client and the Pillow image-manipulation library:

```
pip install algorithmia
pip install Pillow
```

Detailed instructions can be found in the [blog post](http://blog.algorithmia.com/).

## How To Run the Script

First, edit the script and replace `your_api_key` with your [Algorithmia API Key](http://developers.algorithmia.com/basics/customizing-api-keys/)

Also replace `/some/filename.jpg` with a path to a JPEG image on your local filesystem, and `/some/outputfile.jpg` with the desired path for the output file.

Use the command line, and navigate to the folder with your Python file and run:

```
python horizon-detector.py
```

## Built With

* [Algorithmia](https://algorithmia.com)
* [Horizon Detection](https://algorithmia.com/algorithms/ukyvision/deephorizon)
* [Pillow](http://python-pillow.org/)

