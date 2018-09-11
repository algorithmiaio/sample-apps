# Naive Bayes Classification Demo

In this hands-on tutorial, we'll go through how to host a pre-trained R model and data on Algorithmia, learn how to deploy a that model into production, and then call the algorithm once it's been deployed to make inferences.

## Prerequisites 

Clone [this repository](https://github.com/algorithmiaio/sample-apps/) so you have access to the code and data files. While we will use the Algorithmia Web IDE in this demo, note that you can use the [CLI](https://algorithmia.com/developers/clients/cli/) to deploy your model instead once you've [Created an Algorithm](https://algorithmia.com/developers/algorithm-development/languages/r/#create-an-algorithm) and cloned your repository.

Alternatively you can simply download the repository as a .zip and get the data and code from `sample-apps/algo-dev-demo/classification-naivebayes-r/`

## Upload Your Data To Data Collections

In this demo, we are going to host our data on the Algorithmia platform in [Data Collections](https://algorithmia.com/developers/data/hosted/). 

You'll want to create a data collection to host your saved model and your test data: 

- Login to your Algorithmia account and click your avatar which will show a dropdown of choices. Click **"Manage Data"**

- Then in the left panel on the page of data collection options, go ahead and click **"My Hosted Data"**

- Click on **“Add Collection”** under the “My Collections” section on your data collections page. Let's name ours "iris_r_demo"

- After you create your collection you can set the read and write access on your data collection. We are going to select **"Private"** since only you will be calling your algorithm in this instance. 

- Now, let's put some data into your newly created data collection. You can either drag and drop the files [naive_bayes_iris.rds](https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/classification-naivebayes-r/naive_bayes_iris.rds) or you can click **"Drop files here to upload"** from where you stored the repo on your computer.

## Create Your Algorithm

Now we are ready to deploy our model.

### First create an algorithm
- Click the **"Plus"** icon at the top right of the navbar
- Let's go through the form together to create our algorithm
- Click on the tab **"Source"** and you'll notice boilerplate code for Hello World.
- Let's delete that code, and copy and paste the code from the file [demo.R](https://github.com/algorithmiaio/sample-apps/blob/master/algo-dev-demo/classification_naivebayes_r/demo.R)
- Note that you'll need to change the name of the data collection path to the one we created earlier. 

Recall our data collection is called "iris_r_demo" and you'll need
to change "YOUR_USERNAME" to your own username: `file_path =
'data://YOUR_USERNAME/iris_r_demo/naive_bayes_iris.rds'`

### Add Dependencies
- Click the **"Dependencies"** button in the grey navbar.
- Add Dependencies to the CRAN file under the ones that already exist, adding:
```
e1071
```
 
### Code Example
- This will be a brief description of the code example including where to load the model. 

Note you always want to initialize the model outside of the algorithm function (in Python it's called apply function). This way, after the model is initially loaded, subsequent calls will be much faster within that session.

### Compile Code
- Click the **"Compile"** button in the top right of the grey navbar
- Now test your code in the console by passing in the data file we stored in our data collection.
- **REMEMBER:** Change YOUR_USERNAME to your own name in the model path on line 15 of the code example.

In this case we simply passed in a string, but we recommend to create a more robust data structure such as an R list or Python dictionary. That way you can allow for various input types, output files, and other customizations.

### Developer Center
- While the first commit and compile is occuring, this is a good opportunity to introduce where to find the documentation. Welcome to the [Developer Center](https://algorithmia.com/developers/) where you can find documentation on [R algorithm development](https://algorithmia.com/developers/algorithm-development/languages/r/) and an [R Shiny app example](https://algorithmia.com/developers/tutorials/sample-apps/shiny-app/).

### Pass in user Input
- In the web console, paste in: "data://YOUR_USERNAME/iris_r_demo/naive_bayes_iris.csv" string.

### Publishing Your Model
We'll cover adding your sample I/O, versioning, release notes, and best practices of creating your algorithms.

## Documentation

- [R Client Guides](https://algorithmia.com/developers/algorithm-development/languages/r/)
- [Documentation for Scikit-Learn](https://algorithmia.com/developers/model-deployment/scikit/)
- [Documentation for Tensorflow](https://algorithmia.com/developers/model-deployment/tensorflow/)
- [Working with Data](https://algorithmia.com/developers/data/)

