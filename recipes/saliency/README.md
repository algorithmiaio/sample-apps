# Improve Saliency Detection Accuracy

[SalNet](https://algorithmia.com/algorithms/deeplearning/SalNet) is a saliency detection microservice hosted on [Algorithmia](https://algorithmia.com/), which allows you to easily integrate saliency detection into your product via a serverless API.

Most images do very well using SalNet, however some older, fuzzier images might need a little help from another algorithm called [Sharpen Image](https://algorithmia.com/algorithms/opencv/SharpenImage).

This algorithm uses an unsharp mask to sharpen the edges in the image, which increases the ability of the saliency detection algorithm to find the most relevant shapes in an image.

For the full blog post related to this recipe, see [Improving Saliency Detection](http://blog.algorithmia.com/improve-saliency-detection-accuracy/).

## Getting Started

Install the Algorithmia client from PyPi:

```pip install algorithmia```

You’ll also need a free Algorithmia account.

Sign up [here](https://algorithmia.com/), and then grab your [API key](algorithmia.com/user#credentials).

Find this line in the script: 

```
client = Algorithmia.client("YOUR_API_KEY")
```
and add in your API key.

## How to Sharpen Images and Find the Saliency of those Images

After putting in your own API key to the line above run it in your console environment:

```python saliency__algorithm_recipe.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [SalNet](https://algorithmia.com/algorithms/deeplearning/SalNet)
* [Sharpen Image](https://algorithmia.com/algorithms/opencv/SharpenImage)
