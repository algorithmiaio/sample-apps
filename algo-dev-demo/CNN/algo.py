import Algorithmia
import numpy as np
from PIL import Image
import torch
from torch.autograd import Variable
import torch.nn.functional as F
from torchvision import transforms

# Simple wrapper class: details at blog.algorithmia.com/convolutional-neural-nets-in-pytorch
class SimpleCNN(torch.nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        self.conv1 = torch.nn.Conv2d(3, 18, kernel_size=3, stride=1, padding=1)
        self.pool = torch.nn.MaxPool2d(kernel_size=2, stride=2, padding=0)
        self.fc1 = torch.nn.Linear(18 * 16 * 16, 64)
        self.fc2 = torch.nn.Linear(64, 10)
    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = self.pool(x)
        x = x.view(-1, 18 * 16 * 16)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return (x)

# Create a SimpleCNN model and load saved parameters
myCNN = SimpleCNN()
client = Algorithmia.client()

# Replace this with your own model file URI
modelFile = client.file('data://username/demo/simplecnn.pt').getFile().name
myCNN.load_state_dict(torch.load(modelFile))

# Define CIFAR-10 classes
labels = ('plane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck')

# API calls begin at the apply() method
def apply(imgPath):
    # Download image from URL: details at algorithmia.com/algorithms/util/SmartImageDownloader
    imgPath = client.algo('util/SmartImageDownloader/0.2.18').pipe(imgPath).result['savePath'][0]
    imgFile = client.file(imgPath).getName()
    # Predict, and return text label
    prediction = predict(imgFile)
    return labels[prediction]

def predict(imgFile):
    # Normalize and resize image
    normalize = transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    composed = transforms.Compose([transforms.Resize(32), transforms.ToTensor(), normalize])
    img = Image.open(imgFile)
    img.load()
    # If the image isn't a square, make it a square
    if img.size[0] != img.size[1]:
        sqrWidth = np.ceil(np.sqrt(img.size[0] * img.size[1])).astype(int)
        input = composed(img.resize((sqrWidth, sqrWidth)))
    else:
        input = composed(img)
    # Pytorch has very specific requirements for input formats
    outputs = myCNN(Variable(torch.stack([input])))
    _, predicted = torch.max(outputs.data, 1)
    return int(predicted.numpy())