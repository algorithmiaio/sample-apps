# Keras MNIST Demo

In this demo we'll go through how to host your data on Algorithmia, you'll learn how to deploy your pre-trained Keras model and finally we'll call the algorithm once it's been deployed to make inferences.

While we will use the Algorithmia Web IDE in this demo, note that you can use the [CLI](https://algorithmia.com/developers/clients/cli/) to deploy your model instead once you've [Created an Algorithm](https://algorithmia.com/developers/algorithm-development/languages/python/#create-an-algorithm) and cloned your repository.

#### Before you begin
1. Create an account on [algorithmia.com](https://algorithmia.com/)

#### Upload your model
In this demo, we are going to host our data on the Algorithmia platform in [Data Collections](https://algorithmia.com/developers/data/hosted/).  We'll download the pre-trained Keras model and sample data from this repository, create a data collection on Algorithmia, and upload the files there.

1. Download [mnist_model.h5](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/keras-mnist/data/mnist_model.h5) and [test_keras_data.csv.zip](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/keras-mnist/data/test_keras_data.csv.zip) from this repository
2. Click **"Data"** in the header nav at [algorithmia.com](https://algorithmia.com/), then click "[My Hosted Data](https://algorithmia.com/data/hosted)"
3. Click **"Add Collection"** under the **"My Collections"** section on your data collections page, and name the new collection **"keras_model"**
4. Upload **"mnist_model.h5"** and **"test_keras_data.csv.zip"** via the **"Drop files here to upload"** box
5. Take note of the URIs which appear below the uploaded files (e.g. **"data://username/keras_model/mnist_model.h5"**)

#### Create your algorithm
1. Click the **"+"** in the upper-right of [algorithmia.com](https://algorithmia.com/) to create a new algorithm
2. Give your algorithm any name, pick **"Python 3"**, **"Full access to
   internet"** and **"Can call other algorithms"** (not "Advanced GPU") -- then
   click Create Algorithm
3. Click **"Algorithmia Web IDE"** in the subscript near the bottom of the popup. If you've closed the popup already,just click the **"source"** tab of the page. 
4. Copy-and-paste the content of [demo.py](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/keras-mnist/demo.py) into the code editor, replacing the default code
5. In the code, replace `data://jpeck/keras_model/mnist_model.h5` with corresponding URI from your own data collection

#### Add dependencies
1. Click the **"Dependencies"** button in the grey navbar.
2. Add Dependencies to the requirements.txt file under the ones that already exist, adding:
```
tensorflow
keras
h5py
```

#### Compile and test your algorithm

Review the code, verifying that you've replaced the `data://` URI correctly.  Also note that the model is initialized outside of the apply function (in R it's called the algorithm function). This way, after the model is initially loaded, subsequent calls will be much faster within that session.

1. Click the **"Compile"** button in the top right of the grey navbar, and wait for the indicator to stop spinning
2. Test your code in the console by pasting in the quoted URI of the zipped csv you uploaded earlier (`"data://YOUR_USERNAME/keras_model/test_keras_data.csv.zip"` with `YOUR_USERNAME` replaced).

Note that we are passing in a JSON serializable object and recommend that your algorithm takes a robust data structure that allows for various input types, output files, and other customizations.

### Publishing your algorithm
1. Click "publish" and walk through the dialogs, setting the modified `data://YOUR_USERNAME/keras_model/mnist_model.h5` as the sample input
2. Test out your new Algorithm by clicking "Run Example"

## Documentation

- [Documentation for Keras](https://algorithmia.com/developers/algorithm-development/model-guides/keras/)
- [Keras Demo](https://algorithmia.com/algorithms/stephanie/keras_guide) Note: this is slightly different than this guide's code as it takes a csv file rather than the .zip file.
- [Documentation for Tensorflow](https://algorithmia.com/developers/algorithm-development/model-guides/tensorflow/)
- [Working with Data](https://algorithmia.com/developers/data/)
