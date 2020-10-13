# Create a Custom Color Scheme From Your Favorite Website

This code snippet shows how to use Algorithmia to grab all the links from a webThis recipe allows you to pipe in several images, including ones that are a montage of other images in order to get a personalized color scheme.

While there are plenty of online color scheme generators, none can generate random color palettes from multiple images found on your favorite design blog or shopping site.

This recipe will show you how to extract image links from a url that has multiple images on it, get the color schemes from those image urls and generate a new custom color scheme made of five random hexadecimal colors. Then you can plug them into Adobe Color Wheel or another online color scheme creator and visualize your new color scheme.

For the full blog post related to this recipe, see [Create a Custom Color Scheme From Your Favorite Website](http://blog.algorithmia.com/create-a-custom-color-scheme-from-your-favorite-website).

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

## How to Extract Colors from Images

After putting in your own API key to the line above run it in your console environment:

```python color_extraction_recipe.py```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [Get Image Links](https://algorithmia.com/algorithms/diego/Getimagelinks)
* [Color Scheme Extraction](https://algorithmia.com/algorithms/vagrant/ColorSchemeExtraction)

