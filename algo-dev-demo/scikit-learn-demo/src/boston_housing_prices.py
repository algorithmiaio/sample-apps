import sys

import joblib
import numpy as np
import Algorithmia
from Algorithmia.errors import AlgorithmException


client = Algorithmia.client()


def load_model():
    # Get file by name
    file_path = "data://USERNAME/scikit_learn_demo/scikit-demo-boston-regression.joblib"
    model_path = client.file(file_path).getFile().name

    # Open file and load model
    with open(model_path, "rb") as f:
        model = joblib.load(f)
        return model


# Load model outside of the apply function so it only gets loaded once per session
model = load_model()


def apply(input):
    if isinstance(input, dict):
        if "predict" in input.keys():
            return model.predict(input["predict"]).tolist()
        elif "batch" in input.keys():
            np_data = process_input(input["batch"])
            return model.predict(np_data).tolist()
        else:
            raise AlgorithmException(
                "Invalid input JSON format, only `predict` and `batch` are valid fields"
            )
    else:
        raise AlgorithmException("Input should be JSON")


def process_input(fpath):
    # Create numpy array from csv file passed as input in apply()
    if fpath.startswith("data:"):
        file_url = client.file(fpath).getFile().name
    else:
        file_url = fpath

    try:
        np_array = np.genfromtxt(file_url, delimiter=",")
        return np_array
    except Exception as e:
        print("Could not create numpy array from data", e)
        sys.exit(0)


if __name__ == "__main__":
    pass
    # fmt: off
    # print(apply({"predict": [[0.01778,95,1.47,0,0.403,7.135,13.9,7.6534,3,402,17,384.3,4.45]]}))
    # print(apply({"batch": "data/boston_test_data.csv"}))
    # print(apply({"batch": "data://YOUR_USERNAME/boston_test_data.csv"}))
