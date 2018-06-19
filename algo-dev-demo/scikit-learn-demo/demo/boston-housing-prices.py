import sys
import pickle
import csv
import numpy as np
import Algorithmia

from sklearn.datasets import load_boston
from sklearn.ensemble import RandomForestRegressor

client = Algorithmia.client()

def load_model():
    # Get file by name
    # Open file and load model
    file_path = 'data://demo/demo/scikit-demo-boston-regression.pkl'
    model_path = client.file(file_path).getFile().name
    # Open file and load model
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
        return model

# Load model outside of the apply function so it only gets loaded once
model = load_model()


def process_input(input):
    # Create numpy array from csv file passed as input in apply()
    if input.startswith('data:'):
        file_url = client.file(input).getFile().name
        try:
            np_array = np.genfromtxt(file_url, delimiter=',')
            print(np_array)
            return np_array
        except Exception as e:
            print("Could not create numpy array from data", e)
            sys.exit(0)


def apply(input):
    # Input should be a csv file - model is trained on Sklearn 
    # Boston housing dataset using RandomForestRegressor
    np_data = process_input(input)
    prediction = model.predict(np_data)
    return list(prediction)
