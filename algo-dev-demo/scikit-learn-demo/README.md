# Scikit-Learn Demo

In this demo we'll go through how to host your data on Algorithmia, you'll learn how to deploy your pre-trained Scikit-Learn model and finally we'll call the algorithm once it's been deployed to make inferences.

## Prerequisites 

Fork this repository so you have access to the code and data files. While we will use the Algorithmia Web IDE in this demo, note that you can use the [CLI](https://algorithmia.com/developers/clients/cli/) to deploy your model instead once you've [Created an Algorithm](https://algorithmia.com/developers/algorithm-development/languages/python/#create-an-algorithm) and cloned your repository.

## Upload Your Data To Data Collections

In this demo, we are going to host our data on the Algorithmia platform in [Data Collections](https://algorithmia.com/developers/data/hosted/). 

You'll want to create a data collection to host your pickled model and your test data: 

- Login to your Algorithmia account and click your avatar which will show a dropdown of choices. Click **"Manage Data"**

- Then in the left panel on the page of data collection options, go ahead and click **"My Hosted Data"**

- Click on **“Add Collection”** under the “My Collections” section on your data collections page. Let's name ours "scikit_learn_demo"

- After you create your collection you can set the read and write access on your data collection. We are going to select **"Private"** since only you will be calling your algorithm in this instance. 

- Now, let's put some data into your newly created data collection. You can either drag and drop the files [scikit-demo-boston-regression.pkl](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/scikit-learn-demo/data/scikit-demo-boston-regression.pkl) and [boston_test_data.csv](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/scikit-learn-demo/data/boston_test_data.csv) or you can click **"Drop files here to upload"** from where you stored the repo on your computer.

## Create Your Algorithm

Now we are ready to deploy our model.

### First create an algorithm
- Click the **"Plus"** icon at the top right of the navbar
- Let's go through the form together to create our algorithm
- Click on the tab **"Source"** and you'll notice boilerplate code for Hello World.
- Let's delete that code, and copy and paste the code from the file [boston-housing-prices.py](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/scikit-learn-demo/demo/boston-housing-prices.py)
- Note that you'll need to change the name of the data collection to the one we created earlier. 

Recall our data collection is called "scikit_learn_demo" and you'll need to change the username "demo" to your username:
`file_path = 'data://YOUR_USERNAME/scikit_learn_demo/scikit-demo-boston-regression.pkl'`

### Add Dependencies
- Click the **"Dependencies"** button in the grey navbar.
- Add Dependencies to the requirements.txt file under the ones that already exist, adding:
```
 numpy
 scikit-learn>=0.14,<0.18
```
 
### Code Example
- This will be a brief description of the code example including where to load the model. 

Note you always want to initialize the model outside of the apply function (in R it's called the algorithm function). This way, after the model is initially loaded, subsequent calls will be much faster within that session.

### Compile Code
- Click the **"Compile"** button in the top right of the grey navbar
- Now test your code in the console by passing in the data file we stored in our data collection.

In this case we simply passed in a string, but we recommend to create a more robust data structure such as a Python dictionary, or an R list. That way you can allow for various input types, output files, and other customizations.

### Publishing Your Model
We'll cover adding your sample I/O, versioning, release notes, and best practices of creating your algorithms.

## Documentation

- [Documentation for Scikit-Learn](https://algorithmia.com/developers/algorithm-development/model-guides/scikit/)
- [Documentation for Tensorflow](https://algorithmia.com/developers/algorithm-development/model-guides/tensorflow/)
- [Working with Data](https://algorithmia.com/developers/data/)

