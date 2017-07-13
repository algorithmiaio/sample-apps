# Train a Face Recognition Model to Recognize Celebrities

Earlier this week we introduced [Face Recognition](https://algorithmia.com/algorithms/cv/FaceRecognition), a trainable model that is hosted on Algorithmia. This model enables you to train images of people that you want the model to recognize and then you can pass in unseen images to the model to get a prediction score.

The great thing about this algorithm is that you don't have to have a huge dataset to get a high accuracy on the prediction scores of unseen images. The Face Recognition algorithm trains your data quickly using at least ten images of each person that you wish to train on.

Learn how to use the Face Recognition model so you can see which celebrity you look most like. 


For the full blog post related to this recipe, see [Train a Face Recognition Model to Recognize Celebrities](blog.algorithmia.com/
train-a-face-recognition-model-to-recognize-celebrities).

## Getting Started

Install the Algorithmia client from PyPi:

```pip install algorithmia```

You’ll also need a free Algorithmia account, which includes 5,000 free credits a month – more than enough to get started with crawling, extracting, and analyzing web data.

Sign up [here](https://algorithmia.com/), and then grab your [API key](algorithmia.com/user#credentials).

Find this line in the script: 

```
client = Algorithmia.client("YOUR_API_KEY")
```
and add in your API key.

## How to Train the Face Recognition Model

After putting in your own API key to the line above run it in your console environment:

```python face_recognition.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [Algorithmia Hosted Data](https://algorithmia.com/developers/data/hosted/)
* [Face Recognition](https://algorithmia.com/algorithms/cv/FaceRecognition)


