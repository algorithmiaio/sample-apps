import os
import csv
import sys
import logging
import Algorithmia

# Logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

logFile = logging.FileHandler(
    'logs/twitter_pull_data.log')
logFile.setLevel(logging.INFO)

# Creating a custom log format for each line in the log file
formatter = logging.Formatter('%(asctime)s : %(levelname)s : %(message)s')
logFile.setFormatter(formatter)
logger.addHandler(logFile)


# Pass in string query as sys.argv
q_input = sys.argv[1]


def pull_tweets():
    """Pull tweets from Twitter API via Algorithmia."""
    input = {
        "query": q_input,
        "numTweets": "700",
        "auth": {
            "app_key": 'your_consumer_key',
            "app_secret": 'your_consumer_secret_key',
            "oauth_token": 'your_access_token',
            "oauth_token_secret": 'your_access_token_secret'
        }
    }
    client = Algorithmia.client('your_algorithmia_api_key')
    algo = client.algo('twitter/RetrieveTweetsWithKeyword/0.1.3')

    tweet_list = [{'user_id': record['user']['id'],
                   'retweet_count': record['retweet_count'],
                   'text': record['text']}
                  for record in algo.pipe(input).result]
    return tweet_list


def write_data():
    # Write tweet records to csv for later data processing
    data = pull_tweets()
    filename = os.path.join(q_input.replace(' ', '-'))
    try:
        with open('data/{0}.csv'.format(filename), 'w') as f:
            fieldnames = ['user_id', 'retweet_count', 'text']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for record in data:
                writer.writerow(record)

    except Exception as e:
        logger.info(e)

if __name__ == '__main__':
    write_data()
