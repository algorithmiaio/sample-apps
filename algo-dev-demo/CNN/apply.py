#!/usr/bin/env python

from PIL import Image
import numpy as np
import torch
from torch.autograd import Variable
from torchvision import transforms
import sys

#Load source code of the CNN model
from SimpleCnnModel import SimpleCNN

#Define CIFAR-10 classes
classes = ('plane', 'car', 'bird', 'cat',
           'deer', 'dog', 'frog', 'horse', 'ship', 'truck')

#Create an instance of the SimpleCNN model
newCNN = SimpleCNN()

#Load saved parameters into the instance
newCNN.load_state_dict(torch.load('simpleCNN.pt'))

#Define function to preprocess images
def preprocess(input_image):
    #Normalize and resize image
    normalize = transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    composed = transforms.Compose([transforms.Resize(32), transforms.ToTensor(),normalize])
    img = Image.open(input_image)
    img.load()
    #If the image isn't a square, make it a square
    if img.size[0] != img.size[1]:
        sqrWidth = np.ceil(np.sqrt(img.size[0]*img.size[1])).astype(int)
        img_resize = img.resize((sqrWidth, sqrWidth))
        output = composed(img_resize)
    else:
        output = composed(img)
    return output
    
#Define prediction function
def predict(input, newCNN):
	#Pytorch has very specific requirements for input formats
    outputs = newCNN(Variable(torch.stack([input])))
    _, predicted = torch.max(outputs.data, 1)
    return int(predicted.numpy())

#Preprocess image
preprocessed = preprocess(sys.argv[1])	

#Predict, and index classes array to get text label
print("Actual: " + sys.argv[1] + ". Predicted: " + classes[predict(preprocessed, newCNN)])