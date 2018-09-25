"""
Functions to handle MNIST data extraction and loading 

Adopted from https://github.com/tensorflow/tensorflow/blob/v0.6.0/tensorflow/examples/tutorials/mnist/input_data.py
"""

import struct
import gzip
import numpy as np

def extract_images(filename, img):
    try:
        with gzip.open(filename) as gz:
            n = struct.unpack('I', gz.read(4))
            # Read magic number.
            if n[0] != 0x3080000:
                raise Exception('Invalid file: unexpected magic number.')
            # Read number of entries.
            n = struct.unpack('>I', gz.read(4))[0]
            if n != img:
                raise Exception('Invalid file: expected {0} entries.'.format(img))
            crow = struct.unpack('>I', gz.read(4))[0]
            ccol = struct.unpack('>I', gz.read(4))[0]
            if crow != 28 or ccol != 28:
                raise Exception('Invalid file: expected 28 rows/cols per image.')
            # Read data.
            res = np.fromstring(gz.read(img * crow * ccol), dtype = np.uint8)
    except Exception as e:
        print(e)
    return res.reshape((img, crow * ccol))

def dense_to_one_hot(labels_dense, num_classes=10):
  """Convert class labels from scalars to one-hot vectors."""
  num_labels = labels_dense.shape[0]
  index_offset = np.arange(num_labels) * num_classes
  labels_one_hot = np.zeros((num_labels, num_classes))
  labels_one_hot.flat[index_offset + labels_dense.ravel()] = 1
  return labels_one_hot

def extract_labels(filename, img):
    try:
        with gzip.open(filename) as gz:
            n = struct.unpack('I', gz.read(4))
            # Read magic number.
            if n[0] != 0x1080000:
                raise Exception('Invalid file: unexpected magic number.')
            # Read number of entries.
            n = struct.unpack('>I', gz.read(4))
            if n[0] != img:
                raise Exception('Invalid file: expected {0} rows.'.format(img))
            # Read labels.
            res = np.fromstring(gz.read(img), dtype = np.uint8)
    except Exception as e:
        print(e)
    return dense_to_one_hot(res)

def load_mnist(image_data, label_data, img):
    data = extract_images(image_data, img)
    labels = extract_labels(label_data, img)
    return {"images": data, "labels": labels}


