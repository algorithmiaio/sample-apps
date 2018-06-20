# Scikit-Learn Demo

In this demo we'll go through how to host your data on Algorithmia, you'll learn how to deploy your pre-trained Scikit-Learn model and finally we'll call the algorithm once it's been deployed to make inferences.

## Prerequisites 

Fork this repository so you have access to the code and data files. While we will use the Algorithmia Web IDE in this demo, note that you can use the [CLI](https://algorithmia.com/developers/clients/cli/) to deploy your model instead once you've [Created an Algorithm](https://algorithmia.com/developers/algorithm-development/languages/python/#create-an-algorithm) and cloned your repository.

## Upload Your Data To Data Collections

In this demo, we are going to host our data on the Algorithmia platform in [Data Collections](https://algorithmia.com/developers/data/hosted/). 

Now you'll want to create a data collection to host your pickled model and your test data: 

- Login to your Algorithmia account and click your avatar which will show a dropdown of choices. Click **"Manage Data"**

- Then in the left panel on the page of data collection options, go ahead and click **"My Hosted Data"**

- Click on **“Add Collection”** under the “My Collections” section on your data collections page. Let's name ours "Scikit-Learn-demo"

- After you create your collection you can set the read and write access on your data collection. We are going to select **"Private"** since only you will be calling this algorithm. 

- Now, let's put some data into your newly created data collection. You can either drag and drop the files [scikit-demo-boston-regression.pkl](sample-apps/algo-dev-demo/scikit-learn-demo/data/scikit-demo-boston-regression.pkl) and [boston_test_data.csv](sample-apps/algo-dev-demo/scikit-learn-demo/data/boston_test_data.csv) or you can click **"Drop files here to upload"** from where you stored the repo on your computer.

## Create Your Algorithm

Now we are ready to deploy our model.

### First create an algorithm
- Click the **"Plus"** icon at the top right of the navbar
- Let's go through the form together
- Go through the tabs and discover the web IDE
- Click on the tab **"Source"** and you'll notice boilerplate code for Hello World.
- Let's delete that code, and copy and paste the code from the file [boston-housing-prices.py](sample-apps/algo-dev-demo/scikit-learn-demo/demo/boston-housing-prices.py)
- Note that you'll need to change the name of the data collection to the one we created earlier. Recall our data collection is called "Scikit-Learn-demo".

### Add Dependencies
- Click the **"Dependencies"** button in the grey navbar.
- Add Dependencies to the requirements.txt file under the ones that already exist:
 --numpy
 --sklearn
 
### Code Example
- This will be a brief description of the code example including where to load the model

### Compile Code
- Click the **"Compile"** button in the top right of the grey navbar
- The first time you compile it will take longer than subsequent calls
- Now test your code in the console by passing in the data file we stored in our data collection.

In this case we simply passed in a string, but we recommend to create a more robust data structure such as a Python dictionary, or an R list. That way you can let users pass in input files, output files, and other customizations.

### Publishing Your Model
We'll cover adding your sample I/O, versioning, release notes, and best practices of creating your algorithms.


