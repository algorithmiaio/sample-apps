import Algorithmia
from sklearn.externals import joblib
from PIL import Image
import numpy as np

client = Algorithmia.client()

# load model from Data URI - see https://algorithmia.com/developers/data/
modelFile = client.file('data://username/demo/digits_classifier.pkl').getFile().name
model = joblib.load(modelFile)

def apply(imgPath):
    # (optional) use SmartDownloader to download image safely - see https://algorithmia.com/algorithms/util/SmartImageDownloader
    imgPath = client.algo('util/SmartImageDownloader/0.2.18').pipe(imgPath).result['savePath'][0]
    imgFile = client.file(imgPath).getFile().name
    img = Image.open(imgFile)
    # resize and greyscale image
    img = img.resize((8, 8), Image.BICUBIC)
    img = greyscale(img)
    # predict using pre-loaded classifier
    return int(model.predict([img.flatten()])[0])

def greyscale(img):
    img = np.array(img)
    greyscale = np.zeros((img.shape[0], img.shape[1]))
    for rownum in range(len(img)):
        for colnum in range(len(img[rownum])):
            greyscale[rownum][colnum] = 255.0 - np.average(img[rownum][colnum])
    amin = np.amin(greyscale)
    greyscale = np.subtract(greyscale, amin)
    P = 1/(np.amax(greyscale) - amin)
    return P * np.array(greyscale)