# Twitter N-Gram Generator

## Generate Random Tweets From Existing Ones

This is a demo of Algorithmia's [Tweet N-Gram](https://algorithmia.com/algorithms/ngram/TweetNgram) algorithm. Enter a twitter handle, and get back a randomly-generated tweet based on that handle's previous tweets.

## See this demo in action

This demo can be viewed at https://algorithmia.com/demo/twitterNgram

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/twitter-ngram/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples)) in the line containing `Algorithmia.query`
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:twitter-ngram`
6. open **/build/twitter-ngram/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
