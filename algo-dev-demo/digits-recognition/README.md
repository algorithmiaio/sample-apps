# Digit recognition demo

In this demo we'll go through deploying a pre-trained [scikit-learn](https://scikit-learn.org/) model for hand written digits recognition and we will explore some options to query this model to make inferences.

The trained model is based on the [scikit-learn documentation](https://scikit-learn.org/stable/auto_examples/classification/plot_digits_classification.html).

This demo features:

- Hosting models in the Algorithmia platform
- Calling other algorithms as part of the inference pipeline, in this case for image preprocessing
- Use of multiple query types, in this case: url and base64

## Prerequisites

Fork this repository so you have access to the algorithm code and data files. We will use the Algorithmia Web IDE in this demo but note that you can also use a repository [from Github](https://algorithmia.com/developers/algorithm-development/source-code-management) or you can use the [CLI](https://algorithmia.com/developers/clients/cli/) to deploy your model instead once you've [created an algorithm](https://algorithmia.com/developers/algorithm-development/languages/python/#create-an-algorithm) and cloned your repository.

## Upload pre-trained model to Data Collections

We are going to host the serialized pre-trained model on the Algorithmia platform, for more info look at the [Data Collections docs](https://algorithmia.com/developers/data/hosted/).

To create a Data Collection:

- Log in to your Algorithmia account and click on **Data Sources** on the left navigation sidebar
- Click on **New Data Source** on the top right corner, select **Hosted Data Collection** and name it `digits_recognition`
- You can now select or drag and drop the pre-trained model: [data/digits-classifier.joblib](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/digits-recognition/data/digits-classifier.joblib) to upload it to the Algorithmia Hosted Collection
- Once the file it's uploaded you can copy the URI by clicking the triple dots to the right of the file name (e.g. `data://<USERNAME>/digits_recognition/digits-classifier.joblib`)

## Create the Algorithm

From the Algorithmia home page click the **Create new** button at the top right of the navbar and select **Algorithm**.
Let's go through the form together to create our algorithm.

- Name the Algorithm `digits_recognition`
- On the **Source Code** section leave **Repository Host** on **Algorithmia** and **Source Code visibility** on **Restricted**
- On the **Environment** section select **Language**: **Python 3** and **Environment**: **Python 3.7**.
- You can leave the other values as the default ones
- Click on **Create new algorithm** at the bottom and click on **Web IDE** on the pop up

## Add the source code

If you are not in the Web IDE already go to the new Algorithm page and click on the **Source Code** tab to go to the Web IDE

- Open the file with the same name as the algorithm, in this case, it would be: `digits_recognition.py`
- Delete that code, and copy and paste the code from the file [src/digits_recognition.py](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/digits-recognition/src/digits_recognition.py)
- Change the path to the serialized model on the Data Collection. Recall our data collection is called `digits_recognition` and you'll also need
to change `USERNAME` to your own username or organization on this line:

```
model_file_path = "data://<USERNAME>/digits_recognition/digits-classifier.joblib"
```

## Add Dependencies

Click the **Dependencies** button in the top navigation.
The new dependencies should be:

```
algorithmia>=1.0.0,<2.0
numpy==1.19.4
scipy==1.5.3
scikit-learn==0.23.2
pillow==6.2.0
```

Click on **Save dependencies** so that it gets saved to the `requirements.txt` file.

## Compile Algorithm

Click the **Build** button in the top right to compile the algorithm, this will take around 1-2 minutes.
You will see something like `Algorithm version algo://<USERNAME>/digits_recognition/ad9bb8c0ae1d9c267ea3803bfa9b7c2652bb1921 is now online` when the model is built, now we can use it to make predictions.

## Making predictions

Now you can make inferences on external images by passing an URL to an image, for example:

```
> {"url": "https://raw.githubusercontent.com/algorithmiaio/sample-apps/master/algo-dev-demo/digits-recognition/images/digit_2.png"}
2
```

You can also pass an base64 encoded image to this algorithm and query it using `curl`, for this you will need an API key, for example on a terminal:


```
export ALGORITHMIA_API_KEY=<API-KEY>
# Create a variable with the base64 encoded image in a single line
export IMAGE_BASE64="$(base64 -w 0 data/digit_2.png)"

# Query the algorithm endpoint
curl -X POST -d '{"base64": "'${IMAGE_BASE64}'"}' -H 'Content-Type: application/json' -H "Authorization: Simple ${ALGORITHMIA_API_KEY}" https://api.algorithmia.com/v1/algo/danielfrg/digits_recognition\?timeout\=300
```

```
{"result":2,"metadata":{"content_type":"json","duration":0.002103184}}
```

Note that querying the model using `curl` requires either a published version of the algorithm or querying it using the hash build as the URL, for example:

```
curl -X POST -d '{"base64": "'${IMAGE_BASE64}'"}' -H 'Content-Type: application/json' -H "Authorization: Simple ${ALGORITHMIA_API_KEY}" https://api.algorithmia.com/v1/algo/danielfrg/digits_recognition/3c76ca7b227c0d636f2ab6ed645956cd3e56b310\?timeout\=300
```

Note that these different query types are defined in the source code we copy/pasted earlier
you can make the algorithms as simple or complex as you need.
