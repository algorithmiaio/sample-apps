import Algorithmia


def extract_metadata(source_uri):
    """Determine if video contains nudity"""
    algo = client.algo('sfw/VideoNudityDetection/0.1.0')
    data = {'source':source_uri}
    return algo.pipe(data).result

# get your API key at algorithmia.com/user#credentials
client = Algorithmia.client('your_api_key')
video = "http://example.com/somevideo.mpg"
print extract_metadata(video)
