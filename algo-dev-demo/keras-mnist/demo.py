"""
    An example of how to load a trained model and use it
    to predict labels for first ten images in MNIST test set.

"""

import numpy as np
from keras.models import load_model
import zipfile
import os
from shutil import rmtree
import Algorithmia

client = Algorithmia.client()

# Set seed for reproducibility
seed = 7
np.random.seed(seed)


def load_keras_model():
    """Load model from data collection."""
    # Change YOUR_USERNAME
    file_uri = "data://YOUR_USERNAME/keras_model/mnist_model.h5"
    # Retrieve file name from data collections.
    saved_model = client.file(file_uri).getFile().name
    model = load_model(saved_model)
    return model

# Function to load model gets called one time
classifier = load_keras_model()


def extract_data(input_file):
    """
    Unzip data file from data collections
    """
    input_zip = client.file(input_file).getFile().name
    # Create directory to unzip model files into
    if os.path.exists("/tmp/unzipped_file/"):
      rmtree('unzipped_file',ignore_errors=True)
    else:
      os.mkdir("/tmp/unzipped_file/")
    zipped_file = zipfile.ZipFile(input_zip)
    # Extract unzipped files into directory created earlier returns none
    file_path = "/tmp/unzipped_file/"
    return zipped_file.extract("test_keras_data.csv", file_path)


def process_input(input):
    """Get saved data model and turn into numpy array."""
    # Create numpy array from csv file passed as input in apply()
    if isinstance(input, dict) and "test_data" in input and input["test_data"].startswith('data:'):
        zipped_input = input["test_data"]
        input_file = extract_data(zipped_input)
        try:
            np_array = np.genfromtxt(input_file, delimiter=',', skip_header=1)
            # Predict only on the first ten images.
            return np_array[:10]
        except Exception as e:
            raise Exception("Could not create numpy array from data", e)
    else:
        raise Exception('Please provide input of the form {"test_data":"data://YOUR_USERNAME/keras_model/test_keras_data.csv.zip"}')


def predict(input):
    """Reshape numpy array and predict new data."""
    pf = process_input(input)
    # Reshape data to be [samples][pixels][width][height]
    pf = pf.reshape(pf.shape[0], 1, 28, 28).astype('float32')
    # Normalize inputs from 0-255 to 0-1
    pf = pf / 255
    pr = classifier.predict_classes(pf)
    # Cast the numpy array predicted values as a list.
    return list(map(lambda x: int(x), pr))


def apply(input):
    """Pass in a csv image file and output prediction."""
    # Passing into the console, replace YOUR_USERNAME
    # {"test_data":"data://YOUR_USERNAME/keras_data/test_keras_data.csv.zip"}
    output = predict(input)
    return output
