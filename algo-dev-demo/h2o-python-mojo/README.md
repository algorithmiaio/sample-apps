# H2O MOJO Python Insurance Claims demo

In this example, we'll walk through the steps to deploy a pre-trained [H2O](https://www.h2o.ai)
model that predicts insurance claims. This model is saved as a MOJO (Model
Object, Optimized). For more information on these objects, refer to the [H2O documentation](http://docs.h2o.ai/h2o/latest-stable/h2o-docs/mojo-quickstart.html).

This example uses the [H2O Python library](http://docs.h2o.ai/h2o/latest-stable/h2o-docs/index.html)
to train a model and generate predictions from the trained model. The model was
trained using the `train.py` script located on this directory, but this MOJO
model could also be trained, saved, and served using other languages that H2O
supports.

This example demonstrates the use of a special environment in Algorithmia that
can be used to run H2O models.

Other examples with H2O:
- [Deploying H2O models (Python)](https://github.com/algorithmiaio/sample-apps/tree/master/algo-dev-demo/h2o-python)

## Prerequisites

Clone this repository to get access to the algorithm code and data files. We
will use the Algorithmia Web IDE in this demo, but you can also use a repository [from GitHub](https://algorithmia.com/developers/algorithm-development/source-code-management)
or the [Algorithmia CLI](https://algorithmia.com/developers/clients/cli/) to
deploy your model instead once you've [created an algorithm](https://algorithmia.com/developers/algorithm-development/languages/python/#create-an-algorithm)
and cloned your repository.

## Upload pre-trained model to a hosted data collection

We are going to host the serialized, pre-trained model on the Algorithmia
platform using [Hosted Data Collections](https://algorithmia.com/developers/data/hosted).

To create a Hosted Data Collection:

- Log in to your Algorithmia account and click on **Data Sources** on the left
  navigation sidebar
- Click on **New Data Source** on the top right corner, select **Hosted Data
  Collection** and name it `h2o_demo`
- You can now select or drag-and-drop the pre-trained model file: [data/DeepLearning_model_python_1611090304383_1.zip](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/h2o-python-mojo/data/DeepLearning_model_python_1611090304383_1.zip)
  to upload it to the Hosted Data Collection in Algorithmia
- Once the file is uploaded, you can copy its path by clicking on the triple dot
  menu on the right side of the file name (e.g.
  `data://<USERNAME>/h2o_demo/DeepLearning_model_python_1611090304383_1.zip`)

## Create the algorithm

From the Algorithmia home page, click on the **Create New** button on the top
right side of the screen and select **Algorithm**. Let's walk through the steps
to create your new algorithm:

- Name the algorithm `h2o_python_mojo`
- In the **Source Code** section, leave **Repository Host** set to
  **Algorithmia** and **Source code visibility** set to **Restricted**
- In the **Environment** section, select **Language**: **Python 3** and
  **Environment**: **Python 3.7 + H2O - Beta**.
- Leave the Algorithm Settings set to their default values
- Click on **Create New Algorithm** at the bottom, then click on **Web IDE** in
  the pop up

## Add source code

If you are not already in the Web IDE, navigate to the new Algorithm page and
click on the **Source Code** tab to open the Web IDE.

- Open the file with the same name as the algorithm, in this case it is:
  `h2o_python_mojo.py`
- Delete the sample code, then copy and paste the code from the file [src/h2o_python_mojo.py](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/h2o-python-mojo/src/h2o_python_mojo.py)
- Change the path to the serialized model file in the Hosted Data Collection.
  Recall that our hosted data collection is called `h2o_demo`, and you'll need
  to change `<USERNAME>` to your own username or organization on the following
  line:

```
model_file_path = "data://<USERNAME>/h2o_demo/DeepLearning_model_python_1611090304383_1.zip"
```

## Add dependencies

Click on the **Dependencies** button in the top navigation menu. The new
dependencies should be specified as:

```
algorithmia>=1.0.0,<2.0
six
h2o==3.32.0.2
pandas==1.0.5
```

Click on **Save dependencies** to save them to the `requirements.txt` file for
your algorithm.

## Compile algorithm

Click on the **Build** button on the top right section of the screen to compile
the algorithm, this will require about 1-2 minutes. You will see a message
similar to
`Algorithm version algo://<USERNAME>/h2o_python_mojo/616c3503d184ee9ed2fc5d0d022f84d60c1f58ed is now online`
when the model build is complete, then you can query the model to generate
predictions.

## Calling your model and generating predictions

Now you can generate inferences using the console at the bottom of the web IDE.

```
> {"District": [1], "Group": "1-1.5l", "Age": ">35", "Holders": [3582]}
{"claims":284.59177736761}
```

You can also query the model using any HTTP client (e.g., using `cURL`). This
requires an Algorithmia API key.

Note that querying the model from outside of Algorithmia requires publishing a
version of your algorithm or the use of the build hash as part of the URL, for
example:

```
export ALGORITHMIA_USERNAME=<USERNAME>
export ALGORITHMIA_API_KEY=<GENERATED-API-KEY>

curl -X POST -d '{"District": [1], "Group": "1-1.5l", "Age": ">35", "Holders": [3582]}' -H 'Content-Type: application/json' -H 'Authorization: Simple '$ALGORITHMIA_API_KEY https://api.algorithmia.com/v1/algo/$ALGORITHMIA_USERNAME/h2o_python_mojo/46ef56efd6eb3542ba8a155c9021b6ea5a1196f2
```
