# Tensorflow MNIST Running On CPU's Demo

In this hands-on tutorial, we'll go through how to host a pre-trained Tensorflow model and the associated data on Algorithmia, learn how to deploy that model into production, and then call the algorithm once it's been deployed to make inferences.

## Prerequisites 

Clone [this repository](https://github.com/algorithmiaio/sample-apps/) so you have access to the code and data files. While we will use the Algorithmia Web IDE in this demo, note that you can use the [CLI](https://algorithmia.com/developers/clients/cli/) to deploy your model instead once you've created your algorithm and cloned your repository.

Alternatively you can simply download the repository as a .zip and get the data and code from `sample-apps/algo-dev-demo/tensorflow-mnist-cpu`

## Upload Your Data To Data Collections

In this demo, we are going to host our data on the Algorithmia platform in [Data Collections](https://algorithmia.com/developers/data/hosted/). 

You'll want to create a data collection to host your saved model and your test data: 

1. Log in to your Algorithmia account and click your avatar which will show a dropdown of choices. Click **"Manage Data"**

2. Then in the left panel on the page of data collection options, go ahead and click **"My Hosted Data"**

3. Click on **“Add Collection”** under the “My Collections” section on your data collections page. Let's name ours "tensorflow_mnist_data"

4. After you create your collection you can set the read and write access on your data collection. We are going to select **"Private"** since only you will be calling your algorithm in this instance. 

5. Now, let's put some data into your newly created data collection. You can either drag and drop the files in the folder: [tensorflow-mnist-cpu/data](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/tensorflow-mnist-cpu/data) or you can click **"Drop files here to upload"** from where you stored the repo on your computer.

## Create Your Algorithm

Now we are ready to deploy our model.

### First Create an Algorithm
1. Click the **"Plus"** icon at the top right of the navbar
2. Let's go through the form together to create our algorithm
3. Click on the purple "Create Algorithm".

Now that you have created your algorithm, you'll get a modal with information about using the CLI and Git. Every algorithm has a Git repo behind it so you can experiment with different I/O in development mode by calling the hash version.

### Add Code Samples
1. Click on the tab **"Source"** and you'll notice boilerplate code for Hello World.
2. Let's delete that code, and copy and paste the code from the file [demo.py](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/tensorflow-mnist-cpu/demo.py)

Then note that there is another file in the repo called [load-mnist-data.py](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/tensorflow-mnist-cpu/load-mnist-data.py).

3. Create a file in the directory structure to the left of your code in the Web IDE by clicking on "**+** New File" and call it "load-mnist-data.py" then copy and paste from [load-mnist-data.py](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/tensorflow-mnist-cpu/load-mnist-data.py).
4. Recall our data collection is called "tensorflow_mnist_data" and you'll need
to change "YOUR_USERNAME" to your own username: `file_path =
'data://YOUR_USERNAME/tensorflow_mnist_data/model.zip'` on line 41.

### Add Dependencies
1. Click the **"Dependencies"** button in the grey navbar.
2. Add Dependencies to the CRAN file under the ones that already exist, adding:
```
tensorflow
```
 
### Code Description
This will be a brief description of the code example including where to load the model. 

Note you always want to initialize the model outside of the apply() function. This way, after the model is initially loaded, subsequent calls will be much faster within that session.

## Test your Model

### Compile Code
1. Click the **"Compile"** button in the top right of the grey navbar
2. Now test your code in the console by passing in the data file we stored in our data collection.

### Developer Center
While the first commit and compile is occuring, this is a good opportunity to introduce where to find the documentation. Welcome to the [Developer Center](https://algorithmia.com/developers/) where you can find documentation on [Python algorithm development](https://algorithmia.com/developers/algorithm-development/languages/python/) and the full documentation on [Tensorflow](https://algorithmia.com/developers/model-deployment/tensorflow/).

### Pass in user Input
In the web console, paste in: "{"mnist_images": "data://YOUR_USERNAME/tensorflow_mnist_data/t10k-images-idx3-ubyte.gz", "mnist_labels": "data://YOUR_USERNAME/tensorflow_mnist_data/t10k-labels-idx1-ubyte.gz"}" string.

## Deploy Your Model
We'll cover adding your sample I/O, versioning, release notes, and best practices of creating your algorithms.

## Documentation

- [Python Client Guides](https://algorithmia.com/developers/algorithm-development/languages/python/)
- [Documentation for Tensorflow](https://algorithmia.com/developers/model-deployment/tensorflow/)
- [Documentation for Scikit-Learn](https://algorithmia.com/developers/model-deployment/scikit/)
- [Working with Data](https://algorithmia.com/developers/data/)

