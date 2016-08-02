# Sample NLP Approach to Analyzing Twitter, Trump, and Profanity

The twitter_pull_data.py Python script pulls tweets from the Twitter Search API and then the profanity_analysis.py script uses basic natural language processing techniques to clean and process the text data from each tweet. Then it matches each word from the corpus to the ProfanityDetection algorithm to show you swear words and their counts in a dictionary. 

Total these scripts rely on 3 Algorithmia algorithms:

- twitter/RetrieveTweetsWithKeyword/0.1.3
- nlp/ProfanityDetection/0.1.2
- nlp/RetrieveStopWords/0.1.1

To run these scripts you'll first have to install Algorithmia which you can do via pip!

> pip install Algorithmia

Now go to [Twitter OAuth Overview](https://dev.twitter.com/oauth/overview) and follow Twitter's instructions to get your access keys and tokens.

Next you are ready to run the script that pulls the data from the Twitter Search API:

> python twitter_pull_data.py query-parameter

The query-parameter argument can be any string that you wish to pull data about. In our example we used 'Donald Trump OR Trump' and 'Hillary Clinton OR Hillary'. You can combine queries in a number of ways and you can find out more in the [Twitter API Search docs](https://dev.twitter.com/rest/public/search).

Once you have run the above script you can run the profanity_analysis.py script:

> python profanity_analysis.py query-parameter-named-file.csv

The query-parameter-named-file.csv is named after the system argument when you ran the twitter_pull_data.py and if it's multiple words separated by spaces then the query parameters will be joined together with a hyphen.

