# Colorize All Pictures in an S3 bucket or Dropbox directory

This python program runs the [Colorful Image Colorization](algorithmia.com/algorithms/deeplearning/ColorfulImageColorization) algorithm on every image
file in a directory and all children directories. Once it is done, you will see a new file for each image that starts with 'color_' that is the colorized
version of the file. The algorithm uses the PNG format so these colorized images are in that format even if they started in a different format.

You need to have the Algorithmia Python package to run this application. To do that, run
    `pip install Algorithmia`

Before running this algorithm, you need to have an S3 or Dropbox [data connector setup](algorithmia.com/data).

Once you have your connector and api key, you can run this program through the following command:
    `python colorize.py --api-key "YOUR_API_KEY" --connector-path "dropbox+NAME://path/to/directory"`
And if you want to run this on your default dropbox connector, you can drop the "+NAME" part. All of this holds true for S3 connectors as well. So, if you want to run this on the default S3 connector, you would run:
    `python colorize.py --api-key "YOUR_API_KEY" --connector-path "s3://path/to/directory"`

If you have any other questions of comments, you can find more information in the [Algorithmia Developer Center](developers.algorithmia.com) or the [API Docs](docs.algorithmia.com).
