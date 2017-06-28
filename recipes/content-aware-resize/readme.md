# Autogenerate social and hero images via the ContentAwareResize microservice

The [Content Aware Resize microservice](https://algorithmia.com/algorithms/media/ContentAwareResize) from Algorithmia is an API which accepts an image and a target height & width, and creates a cropped image which is automatically centered around the most important parts.

We can use this tool to automatically create images of different sizes, such as those required for hero/banner images or social media posts, without accidentally cropping out faces and other important image features.

For the full blog post related to this recipe, see http://blog.algorithmia.com.

## Getting Started

1. Create a free [Algorithmia account](https://algorithmia.com/signup)

2. Edit content-aware-resize.js and replace `your_api_key` with your [Algorithmia API Key](http://developers.algorithmia.com/basics/customizing-api-keys/)

3. Open content-aware-resize.htm in a web browser

## Notes

This demo directly *includes* the Algorithmia JavaScript library from https://algorithmia.com/v1/clients/js/algorithmia-0.2.0.js, but you can also choose to [download you own copy](https://algorithmia.com/developers/clients/javascript/)

## Built With

* [Algorithmia](https://algorithmia.com)
* [Content Aware Resize microservice](https://algorithmia.com/algorithms/media/ContentAwareResize)

