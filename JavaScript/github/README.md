# GitHub Recommender

## Tag a Public Repository and Get Recommenations for Related Repos

This is a demo of Algorithmia's [Auto-Tag Github](https://algorithmia.com/algorithms/tags/AutoTagGithub) and [Recommend GitHub From Tags](https://algorithmia.com/algorithms/tags/RecommendGitHubFromTags) algorithms. Enter a public git repository, and this tool will use collaborative filtering recommendation algorithms to suggest related repositories.

## See this demo in action

This demo can be viewed at https://algorithmia.com/demo/github

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/github/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=socialimagerec) w/ 5k credits monthly) in the line containing `var apiKey`
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:github`
6. open **/build/github/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
