import json
from pyspark import SparkContext
from pyspark.streaming import StreamingContext
import Algorithmia


# Create a local StreamingContext with two working threads and batch
# interval of 1 second
sc = SparkContext("local[2]", "DeepFashionCounts")
ssc = StreamingContext(sc, 1)
ssc.checkpoint("/tmp/spark-test")


def get_tweets(tweet):
    """Get only the tweets that contain media urls."""
    tweets = json.loads(tweet)
    if "media" in tweets["entities"].keys():
        if "media_url" in tweets["entities"]["media"][0]:
            return True
    return False


def get_articles(tweet_url):
    """Get articles of clothing from tweet urls."""
    input = {
        "image": tweet_url,
        "model": "small",
        "tags_only": True
    }
    # If running on multiple clusters should be created in each partition
    # for performance rather than creating the client on each rdd
    client = Algorithmia.client('YOUR_API_KEY')
    algo = client.algo('algorithmiahq/DeepFashion/1.3.0', 'YOUR_API_ENDPOINT')
    # algo.set_options(timeout=300) # optional
    return algo.pipe(input).result['articles']


def get_url(tweets):
    """Return media url for algorithm input."""
    tweet = json.loads(tweets)
    return tweet["entities"]["media"][0]["media_url"]


def config():
    """Configure PySpark to use local host."""
    ip = "localhost"
    port = 5555
    socket_stream = ssc.socketTextStream(ip, port)
    # One second interval streams.
    lines = socket_stream.window(1)
    return lines


def clothing_dstream():
    lines = config()
    """Returns dstream of tweets filtered by conditions."""
    # These are filtered tweets with media urls in them
    filtered_tweets = lines.filter(lambda rdd_tweet: get_tweets(rdd_tweet))

    # Get the url for each tweet in the dstream
    filtered_dstream = filtered_tweets.map(lambda x: get_url(x))

    articles = filtered_dstream.map(lambda t: get_articles(t))
    return articles


def update_count(current_count, current_state):
    """Get counts of current items adding new items as stream continues."""
    if current_state is None:
        current_state = 0
    return sum(current_count, current_state)


def get_counts():
    """Get the running sum of counts of articles of clothing."""
    try:
        articles = clothing_dstream()
        # Creating counting pairs of returned clothing items
        clothing = articles.flatMap(
            lambda line: [(element['article_name'], 1) for element in line])
        clothing.pprint()
        c = clothing.reduceByKey(
            lambda a, b: a + b).updateStateByKey(update_count)

        c.pprint()

    except Exception as e:
        print(e)
        ssc.stop()


# You must start the Spark StreamingContext, and await process termination…
ssc.start()
ssc.awaitTermination()
