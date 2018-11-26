# Cluster Analysis

## Use K-means Clustering to Classify Data

This is a demo of Algorithmia's [Weka Cluster](https://algorithmia.com/algorithms/kenny/WekaCluster)
microservice.  Generate data points, then use the k-means cluster to classify them into the requested number of groups

## See this demo in action

This demo can be viewed at https://demos.algorithmia.com/cluster

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/cluster/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples) w/ 5k credits monthly) in the line containing `var apiKey`
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:cluster`
6. open **/build/cluster/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
