import Algorithmia
import base64
import math
from PIL import Image


def find_horizon(infile):
    """Find the horizon line on an image"""
    algo = client.algo('ukyvision/deephorizon/0.1.0')
    image = base64.b64encode(open(infile, "rb").read())
    return algo.pipe({'image':'data:image/jpg;base64,'+image.decode("utf-8")}).result


def calculate_rotation(coords):
    """Transform coordinates {left: [x1,y1], right: [x2,y2]} to rotation, in degrees """
    (x1, y1) = coords['left']
    (x2, y2) = coords['right']
    slope = (y2-y1)/(x2-x1)
    return math.degrees(math.atan(slope))


def rotate_image(infile, outfile, degrees, crop):
    """Rotate an image by a number of degrees, crop if desired, and save to outfile"""
    Image.open(infile).rotate(degrees, expand=not crop, resample=Image.BILINEAR).save(outfile)

# get your API key at algorithmia.com/user#credentials
client = Algorithmia.client('your_api_key')
infile = "/some/filename.jpg"
outfile = "/some/outputfile.jpg"
line = find_horizon(infile)
rotation = calculate_rotation(line)
rotate_image(infile, outfile, -rotation, True)
