# scikit-learn Demo

In this demo we'll go through deploying a pre-trained [scikit-learn](https://scikit-learn.org/) model, querying this model to make inferences, how to host your data on Algorithmia, and finally we'll call the algorithm in batch mode on the data we uploaded to Algorithmia.

## Prerequisites

Fork this repository so you have access to the code and data files. While we will use the Algorithmia Web IDE in this demo note that you can also use a repository from Github or you can use the [CLI](https://algorithmia.com/developers/clients/cli/) to deploy your model instead once you've [created an algorithm](https://algorithmia.com/developers/algorithm-development/languages/python/#create-an-algorithm) and cloned your repository.

## Workflow

### Upload pre-trained model to Data Collections

In this demo, we are going to host the serialized pre-trained model and the test data on the Algorithmia platform, for more info look at the [Data Collections docs](https://algorithmia.com/developers/data/hosted/).

To create a Data Collection:

- Log in to your Algorithmia account and click on **Data Sources** on the left navigation sidebar
- Click on **New Data Source** on the top right corner, select **Hosted Data Collection** and name it `scikit_learn_demo`
- You can now either select or drag and drop the files [data/scikit-demo-boston-regression.joblib](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/scikit-learn-demo/data/scikit-demo-boston-regression.joblib) and [data/boston_test_data.csv](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/scikit-learn-demo/data/boston_test_data.csv) to upload them

### Create the Algorithm

From the home page click the **Create new** button at the top right of the navbar and select **Algorithm**.
Let's go through the form together to create our algorithm.

- Name the Algorithm `scikit_learn_demo`
- On the **Source Code** section select Algorithmia and **Source Code visibility**: **Restricted**
- On the **Environment** section select **Language**: **Python 3** and **Environment**: **Python 3.7**.
- You can leave the other values as the default ones
- Click on **Create new algorithm**

### Add the source code

Now click on the **Source Code** tab to go to the Web IDE.

- Open the file with the same name as the algorithm, on this case it would be: `scikit_learn_demo.py`
- Delete that code, and copy and paste the code from the file [demo/boston-housing-prices.py](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/scikit-learn-demo/demo/boston-housing-prices.py)
- Change the name of the data collection to the one we created earlier.

Recall our data collection is called `scikit_learn_demo` and you'll also need
to change `USERNAME` to your own username on this line:

```
file_path = "data://USERNAME/scikit_learn_demo/scikit-demo-boston-regression.pkl"
```

Be sure to save this changes.

Note that you always want to initialize the model outside of the apply function.
This way, after the model is initially loaded, subsequent calls will be much faster within that session.
That is something we do on this example source code.

### Add Dependencies

Click the **"Dependencies"** button in the top navigation.
The new dependencies should be:

```
algorithmia>=1.0.0,<2.0
numpy
scikit-learn==0.23.2
```

Click on **Save dependencies** so that this get saved to the `requirements.txt` file.

### Compile Algorithm

Click the **Build** button in the top right to compile the algorithm, this will take a around 1 minute.
You will see something like `Algorithm version algo://USERNAME/scikit_learn_demo/ad9bb8c0ae1d9c267ea3803bfa9b7c2652bb1921 is now online` when its done.

### Making predictions

Now you can make a real time inference on the model by, for example:

```
> {"predict": [[0.01778,95,1.47,0,0.403,7.135,13.9,7.6534,3,402,17,384.3,4.45]]}
[31.048342563320485]
```

Finally, you can pass the path to the file we uploaded earlier to make a batch prediction:

```
> {"batch": "data://danielfrg/scikit_learn_demo/boston_test_data.csv"}
[31.048342563320485,28.91587252133459 ... ]
```

Note that these different query types are defined in the source code we copy/pasted earlier
you can make the algorithms as simple or complex as you need.

## More documentation

- [Documentation for Scikit-Learn](https://algorithmia.com/developers/algorithm-development/model-guides/scikit/)
- [Working with Data](https://algorithmia.com/developers/data/)
