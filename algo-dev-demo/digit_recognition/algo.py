import Algorithmia
import numpy as np
import pickle
from PIL import Image

client = Algorithmia.client()

# load model from Data URI - see https://algorithmia.com/developers/data/
modelFile = client.file('data://username/demo/digit_classifier.pickle').getFile().name
rbm, logistic, classifier, metrics_results = pickle.load(open(modelFile, 'rb'))

def apply(imgPath):
    # (optional) use SmartDownloader to download image safely - see https://algorithmia.com/algorithms/util/SmartImageDownloader
    imgPath = client.algo('util/SmartImageDownloader/0.2.18').pipe(imgPath).result['savePath'][0]
    imgFile = client.file(imgPath).getFile().name
    # resize and greyscale image
    img = Image.open(imgFile)
    img = img.resize((16, 16), Image.BICUBIC)
    img = greyscale_img(img)
    # predict using pre-loaded classifier
    predicted_num = classifier.predict(img.flatten())[0]
    return int(predicted_num)

def greyscale_img(color_image):
    img = np.array(color_image)
    greyscale = np.zeros((img.shape[0], img.shape[1]))
    for rownum in range(len(img)):
        for colnum in range(len(img[rownum])):
            greyscale[rownum][colnum] = 255.0 - np.average(img[rownum][colnum])
    amin = np.amin(greyscale)
    greyscale = np.subtract(greyscale, amin)
    P = 1/(np.amax(greyscale) - amin)
    return P * np.array(greyscale)