"""
Analyze twitter data for profanity of presidential candidates.

Dependent on: stop word, profanity detection algorithms and twitter_pull.py
"""

import os
import re
import csv
import sys
import Algorithmia as alg


# Add in your Algorithmia API key
client = alg.client('your_algorithmia_api_key')


def read_data():
    """Create the list of Tweets from your query."""
    try:
        filename = os.path.join(sys.argv[1].replace(' ', '-'))
        with open('data/{0}.csv'.format(filename)) as data_file:
            data_object = csv.DictReader(data_file, delimiter=',')
            text_data = [tweets['text'] for tweets in data_object]
        return text_data
    except IndexError as ie:
        print(
            "Input error - did you remember to pass in your system argument?",
            ie)
        sys.exit(1)
    except FileNotFoundError as fe:
        print("File not found - check your directory and filename", fe)
        sys.exit(1)
    except:
        raise


def process_text():
    """Remove emoticons, numbers etc. and returns list of cleaned tweets."""
    stripped_text = [
        re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)|^rt|http.+?" +
               sys.argv[1].lower(), '',
               tweets.lower()).strip() for tweets in read_data()
    ]
    return stripped_text


def remove_stop_words():
    """Remove stop words in tweets."""
    try:
        algo = client.algo('nlp/RetrieveStopWords/0.1.1')
        # Input is an empty list
        stop_word_list = algo.pipe([])
        # If our word is not in the stop list than we add it to our word list
        clean_text = ' '.join([word for sentence in process_text()
                               for word in sentence.split(' ')
                               if word not in stop_word_list.result])
        return clean_text
    except Exception as e:
        print(e)
        sys.exit(1)


def profanity():
    """Return a dictionary of swear words and their frequency."""
    try:
        algo = client.algo('nlp/ProfanityDetection/0.1.2')
        # Pass in the clean list of tweets combined into a single corpus
        result = algo.pipe([remove_stop_words()]).result
        # Total profanity in corpus
        total = sum(result.values())
        print('Resulting swear words and counts: ', result)
        print('total swear words: ', total)
        return {'profanity_counts': result, 'profanity_sum': total}
    except Exception as e:
        print(e)
        sys.exit(1)

if __name__ == '__main__':
    profanity()
