"""Retrieve text content, sentiment from URL."""

import Algorithmia

client = Algorithmia.client("your_api_key")


def get_links():
    """Gets links from URL"""
    input = "https://algorithmia.com/"
    if input.startswith("http") or input.startswith("https"):
        algo = client.algo('web/GetLinks/0.1.5')
        links = algo.pipe(input).result
        return links
    else:
        print("Please enter a properly formed URL")


def get_content():
    """Get text content from URL."""
    data = get_links()
    algo = client.algo("util/Url2Text/0.1.4")
    # Limit content extracted to only blog articles
    content = [{"url": link, "content": algo.pipe(
        link).result} for link in data if link.startswith("http://blog.algorithmia.com")]
    return content


def find_sentiment():
    """Get sentiment from web content."""
    data = get_content()
    algo = client.algo("nlp/SentimentAnalysis/1.0.2")
    try:
        # Find the sentiment score for each article
        algo_input = [{"document": item["content"]} for item in data]
        algo_response = algo.pipe(algo_input).result

        algo_final = [{"url": doc["url"], "sent": sent["sentiment"], "content": sent[
            "document"]} for sent in algo_response for doc in data]
        return algo_final

    except Exception as e:
        print(e)

find_sentiment()
