# H2O Python Insurance Claims demo

In this demo we'll go through deploying a pre-trained [H2O](https://www.h2o.ai) model for insurance claims predictions.

This whole demo uses the [H2O python library](http://h2o-release.s3.amazonaws.com) to train and make prediction of the model.
The model was trained using the `train.py` script located on this directory
but it could also have been trained and serialized in other languages that H2O supports.

This demo features the usage of an special environment designed to run H2O models in Algorithmia.

Other examples with H2O:
- [Deploying H2O MOJO models (Python)](https://github.com/algorithmiaio/sample-apps/tree/master/algo-dev-demo/h2o-python-mojo)

## Prerequisites

Clone this repository so you have access to the algorithm code and data files. We will use the Algorithmia Web IDE in this demo but note that you can also use a repository [from Github](https://algorithmia.com/developers/algorithm-development/source-code-management) or you can use the [CLI](https://algorithmia.com/developers/clients/cli/) to deploy your model instead once you've [created an algorithm](https://algorithmia.com/developers/algorithm-development/languages/python/#create-an-algorithm) and cloned your repository.

## Upload pre-trained model to Data Collections

We are going to host the serialized pre-trained model on the Algorithmia platform, for more info look at the [Data Collections docs](https://algorithmia.com/developers/data/hosted).

To create a Data Collection:

- Log in to your Algorithmia account and click on **Data Sources** on the left navigation sidebar
- Click on **New Data Source** on the top right corner, select **Hosted Data Collection** and name it `h2o_demo`
- You can now select or drag and drop the pre-trained model: [data/DeepLearning_model_python_1610746052547_1](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/h2o-python/data/DeepLearning_model_python_1610746052547_1) to upload it to the Algorithmia Hosted Collection
- Once the file is uploaded you can copy the URI by clicking the triple dots to the right of the file name (e.g. `data://<USERNAME>/h2o_demo/DeepLearning_model_python_1610746052547_1`)

## Create the Algorithm

From the Algorithmia home page click the **Create new** button at the top right of the navbar and select **Algorithm**.
Let's go through the form together to create our algorithm.

- Name the Algorithm `h2o_python`
- On the **Source Code** section leave **Repository Host** on **Algorithmia** and **Source Code visibility** on **Restricted**
- On the **Environment** section select **Language**: **Python 3** and **Environment**: **Python 3.7 + H2O - Beta**.
- You can leave the other values as the default ones
- Click on **Create new algorithm** at the bottom and click on **Web IDE** on the pop up

## Add the source code

If you are not in the Web IDE already go to the new Algorithm page and click on the **Source Code** tab to go to the Web IDE

- Open the file with the same name as the algorithm, in this case, it would be: `h2o_python.py`
- Delete that code, and copy and paste the code from the file [src/h2o_python.py](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/h2o-python/src/h2o_python.py)
- Change the path to the serialized model on the Data Collection. Recall our data collection is called `h2o_demo` and you'll also need to change `USERNAME` to your own username or organization on this line:

```
model_file_path = "data://<USERNAME>/h2o_demo/DeepLearning_model_python_1610746052547_1"
```

## Add Dependencies

Click the **Dependencies** button in the top navigation.
The new dependencies should be:

```
algorithmia>=1.0.0,<2.0
six
h2o==3.32.0.2
pandas==1.0.5
```

Click on **Save dependencies** so that it gets saved to the `requirements.txt` file.

## Compile Algorithm

Click the **Build** button in the top right to compile the algorithm, this will take around 1-2 minutes.
You will see something like `Algorithm version algo://<USERNAME>/h2o_python/616c3503d184ee9ed2fc5d0d022f84d60c1f58ed is now online` when the model is built, now we can query it to make predictions.

## Making predictions

Now you can make inferences using the terminal in the bottom of the web IDE.

```
> {"District": [1], "Group": "1-1.5l", "Age": ">35", "Holders": [3582]}
{"claims":284.59177736761}
```

You can also query the model using any HTTP client for example using `curl`.
This requires an Algorithmia API key.

Note that querying the model this way requires either a published version of the algorithm or querying it using the build hash as part of the URL, for example:

```
export ALGORITHMIA_USERNAME=<USERNAME>
export ALGORITHMIA_API_KEY=<GENERATED-API-KEY>

curl -X POST -d '{"District": [1], "Group": "1-1.5l", "Age": ">35", "Holders": [3582]}' -H 'Content-Type: application/json' -H 'Authorization: Simple '$ALGORITHMIA_API_KEY https://api.algorithmia.com/v1/algo/$ALGORITHMIA_USERNAME/h2o_python/46ef56efd6eb3542ba8a155c9021b6ea5a1196f2
```
