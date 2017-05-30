import Algorithmia
from datetime import datetime


def extract_metadata(source_uri, target_uri):
    """Extract metadata from the video"""
    algo = client.algo('media/VideoMetadataExtraction/0.1.5')
    data = {
        'algorithm':'deeplearning/IllustrationTagger/0.2.5',
        'input_file':source_uri,
        'output_file':target_uri,
    }
    return algo.pipe(data).result

# get your API key at algorithmia.com/user#credentials
client = Algorithmia.client('your_api_key')
video = "http://example.com/somevideo.mpg"
outfile = '.algo/temp/'+str(datetime.now().microsecond)+'.json'
print extract_metadata(video, outfile)
