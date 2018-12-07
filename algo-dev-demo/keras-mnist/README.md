# Keras MNIST Demo

In this demo we'll go through how to host your data on Algorithmia, you'll learn how to deploy your pre-trained Keras model and finally we'll call the algorithm once it's been deployed to make inferences.

## Prerequisites 

Fork this repository so you have access to the code and data files. While we will use the Algorithmia Web IDE in this demo, note that you can use the [CLI](https://algorithmia.com/developers/clients/cli/) to deploy your model instead once you've [Created an Algorithm](https://algorithmia.com/developers/algorithm-development/languages/python/#create-an-algorithm) and cloned your repository.

Or you can simply copy and paste the code example and download the data files. Do note that since the csv file located in the data folder in this repository is rather large, it's hosted as a `.zip` file that you'll be uploading to a data collection.

## Upload Your Data To Data Collections

In this demo, we are going to host our data on the Algorithmia platform in [Data Collections](https://algorithmia.com/developers/data/hosted/). 

You'll want to create a data collection to host the pre-trained Keras model and the sample data to test our algorithm with: 

- Log in to your Algorithmia account and click your avatar which will show a dropdown of choices. Click **"Manage Data"**

- Then in the left panel on the page of data collection options, go ahead and click **"My Hosted Data"**

- Click on **“Add Collection”** under the “My Collections” section on your data collections page. Let's name ours "keras_model_demo"

- After you create your collection you can set the read and write access on your data collection. We are going to select **"Private"** since only you will be calling your algorithm in this instance. 

- Now, let's put some data into your newly created data collection. You can either drag and drop the files [mnist_model.h5](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/keras-mnist/data/mnist_model.h5) and [test_keras_data.csv.zip](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/keras-mnist/data/test_keras_data.csv.zip) or you can click **"Drop files here to upload"** from where you stored the repo on your computer.

## Create Your Algorithm

Now we are ready to deploy our model.

### First create an algorithm
- Click the **"Plus"** icon at the top right of the navbar
- Let's go through the form together to create our algorithm
- Click on the tab **"Source"** and you'll notice boilerplate code for Hello World.
- Let's delete that code, and copy and paste the code from the file [demo.py](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/keras-mnist/demo.py)
- Note that you'll need to change the name of the data collection to the one we created earlier. 

Recall our data collection is called "keras_model_demo" and you'll need
to change "YOUR_USERNAME" to your own username: `file_path =
'data://YOUR_USERNAME/keras_model_demo/mnist_model.h5'`

### Add Dependencies
- Click the **"Dependencies"** button in the grey navbar.
- Add Dependencies to the requirements.txt file under the ones that already exist, adding:
```
tensorflow
keras
h5py
```
 
### Code Example
- This will be a brief description of the code example including where to load the model. 

Note you always want to initialize the model outside of the apply function (in R it's called the algorithm function). This way, after the model is initially loaded, subsequent calls will be much faster within that session.

### Compile Code
- Click the **"Compile"** button in the top right of the grey navbar
- Now test your code in the console by passing in the data file we stored in our data collection.

Note that we are passing in a JSON serializable object and recommend that your algorithm takes a robust data structure that allows for various input types, output files, and other customizations.

### Publishing Your Model
We'll cover adding your sample I/O, versioning, release notes, and best practices of creating your algorithms.

## Documentation

- [Documentation for Keras](https://algorithmia.com/developers/algorithm-development/model-guides/keras/)
- [Keras Demo](https://algorithmia.com/algorithms/stephanie/keras_guide) Note: this is slightly different than this guide's code as it takes a csv file rather than the .zip file.
- [Documentation for Tensorflow](https://algorithmia.com/developers/algorithm-development/model-guides/tensorflow/)
- [Working with Data](https://algorithmia.com/developers/data/)
