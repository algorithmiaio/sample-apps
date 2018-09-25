'''
MNIST prediction from pre-trained model
Tutorial created based on:
https://www.tensorflow.org/versions/r1.0/get_started/mnist/beginners
'''

import Algorithmia
import zipfile
import os
import tensorflow as tf
import shutil
from .loadmnistdata import load_mnist

client = Algorithmia.client()
    
def load_data(input):
    """
    Pass in {"mnist_images": "data://YOUR_USERNAME/tensorflow_mnist_data/t10k-images-idx3-ubyte.gz", 
        "mnist_labels": "data://YOUR_USERNAME/tensorflow_mnist_data/t10k-labels-idx1-ubyte.gz"
    }
    """
    if input["mnist_images"].startswith("data://"):
        # "data://YOUR_USERNAME/tensorflow_mnist_data/t10k-images-idx3-ubyte.gz"
        mnist_images = client.file(input["mnist_images"]).getFile().name
    if input["mnist_labels"].startswith("data://"):
        # "data://YOUR_USERNAME/tensorflow_mnist_data/t10k-labels-idx1-ubyte.gz"
        mnist_labels = client.file(input["mnist_labels"]).getFile().name
    try:
        # load_mnist is a function from loadmnistdata.py to one hot encode images
        data = load_mnist(mnist_images, mnist_labels, 10000)
    except:
        print("Check your mnist image path in your data collection")
    return data


def extract_zip():
    """
    Get zipped model file from data collections
    """
    # Saved model protocol buffer and variables 
    filename = "data://YOUR_USERNAME/tensorflow_mnist_model/model.zip"
    model_file = client.file(filename).getFile().name
    return model_file
    
def extract_model():
    """
    Unzip model files from data collections
    """
    # Model path from data collections
    input_zip = extract_zip()
    try:
        # Create directory to unzip model files into
        os.mkdir("unzipped_files")
        print("Created directory")
    except:
        print("Error in creating directory")
    zipped_file = zipfile.ZipFile(input_zip)
    # Extract unzipped files into directory created earlier returns none
    return zipped_file.extractall("unzipped_files")
    
def generate_gpu_config(memory_fraction):
    config = tf.ConfigProto()
    config.gpu_options.allow_growth = True
    config.gpu_options.per_process_gpu_memory_fraction = memory_fraction
    return config
    
# Unzip model files to directory 
extract_model()

def create_session():
    # Set your memory fraction equal to a value less than 1, 0.6 is a good starting point.
    # If no fraction is defined, the tensorflow algorithm may run into gpu out of memory problems.
    fraction = 0.6
    session = tf.Session(config=generate_gpu_config(fraction))
    path_to_graph = "./unzipped_files/model"
    
    tf.saved_model.loader.load(
        session,
        [tf.saved_model.tag_constants.SERVING],
        path_to_graph)

    y_ = session.graph.get_tensor_by_name('Placeholder_1:0')
    y = session.graph.get_tensor_by_name('Softmax:0')
    x = session.graph.get_tensor_by_name('Placeholder:0')

    return (y_, y, x, session)

# Load model in global state so it only gets initialized once, subsequent calls will be faster
Y_, Y, X, SESSION = create_session()

def predict(mnist):
    correct_prediction = tf.equal(tf.argmax(Y, 1), tf.argmax(Y_, 1))
    calculate_accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
    accuracy = SESSION.run(calculate_accuracy, feed_dict={
        X: mnist["images"], Y_: mnist["labels"]})
    print("accuracy after serialization: {}".format(accuracy))
    predict_values = tf.argmax(Y, 1)
    prediction = predict_values.eval(session=SESSION,feed_dict={X: mnist["images"]})
    print("predicted classes: {}".format(prediction))
    return {"prediction": prediction, "accuracy": accuracy}


# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages
def apply(input):
    data = load_data(input)
    inference = predict(data)
    tf_version = tf.__version__
    return "MNIST Predictions: {0}, TF version: {1}".format(inference, tf_version)
    
