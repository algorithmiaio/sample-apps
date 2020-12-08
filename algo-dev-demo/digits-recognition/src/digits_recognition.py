import base64
import tempfile

import joblib
import numpy as np
import PIL.ImageOps
from PIL import Image
import Algorithmia

from Algorithmia.errors import AlgorithmException


client = Algorithmia.client()
model_file_path = "data://<USERNAME>/digits_recognition/digits-classifier.joblib"


def load_model():
    # Get file by name
    model_path = client.file(model_file_path).getFile().name

    # Open file and load model
    with open(model_path, "rb") as f:
        model = joblib.load(f)
        return model


# Load model outside of the apply function so it only gets loaded once per session
model = load_model()


def apply(query):
    return query
    if isinstance(query, dict):
        if "url" in query.keys():
            # use SmartDownloader to download image safely - see https://algorithmia.com/algorithms/util/SmartImageDownloader
            img_path = (
                client.algo("util/SmartImageDownloader/")
                .pipe(query["url"])
                .result["savePath"][0]
            )
            img_fpath = client.file(img_path).getFile().name

            # NOTE: if util/SmartImageDownloader is not available, replace the prior two lines with:
            # import urllib.request
            # (img_fpath, _) = urllib.request.urlretrieve(img_path)
        elif "base64" in query.keys():
            tempfile_ = base64_to_file(query["base64"])
            img_fpath = tempfile_.name
        elif "path" in query.keys():
            img_fpath = query["path"]
        else:
            raise AlgorithmException(
                "Invalid input JSON format, only `predict` and `batch` are valid fields"
            )
    else:
        raise AlgorithmException("Input should be JSON")

    # Load, resize and greyscale image
    img = Image.open(img_fpath).convert("L")
    img = PIL.ImageOps.invert(img)
    img = img.resize((8, 8), Image.BICUBIC)
    img_array = np.array(img)

    prediction_in = img_array.flatten().reshape(1, -1)
    prediction_in = (prediction_in / 16).round()
    return model.predict(prediction_in).tolist()[0]


def base64_to_file(base64str):
    """
    Takes a base64 enconded string and saves it to a temp file
    Returns a NamedTemporaryFile object
    """
    decoded = base64.decodebytes(bytearray(base64str, "utf8"))
    fp = tempfile.NamedTemporaryFile()
    fp.write(decoded)
    fp.flush()
    return fp


if __name__ == "__main__":
    # fmt: off
    pass
    # print(apply({"path": "data/digit_1.png"}))
    # print(apply({"path": "data/digit_2.png"}))
    # print(apply({"path": "data/digit_3.png"}))
    # print(apply({"url": "https://raw.githubusercontent.com/algorithmiaio/sample-apps/master/algo-dev-demo/digits-recognition/images/digit_1.png"}))
    # print(apply({"url": "https://raw.githubusercontent.com/algorithmiaio/sample-apps/master/algo-dev-demo/digits-recognition/images/digit_2.png"}))
    # print(apply({"url": "https://raw.githubusercontent.com/algorithmiaio/sample-apps/master/algo-dev-demo/digits-recognition/images/digit_3.png"}))
