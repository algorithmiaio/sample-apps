"""Get image URL's from a site and extract unique color palette from images."""
import Algorithmia
import random

client = Algorithmia.client("YOUR_API_KEY")


def get_image(url):
    """Retrieve images from site."""
    algo = client.algo("diego/Getimagelinks/0.1.0")
    if url.startswith("http:") or url.startswith("https:"):
        try:
            response = algo.pipe(url).result
            print(response)
            return response
        except Algorithmia.algo_response.AlgoException as e:
            print(e)
    else:
        raise Exception("Please pass in a valid url")

        
def color_extractor(url):
    """Extract top 15 colors from images."""
    urls = get_image(url)
    algo = client.algo("vagrant/ColorSchemeExtraction/0.2.0")
    response = []
    for path in urls:
        try:
            response.append(algo.pipe({"url": path}).result)
        except Algorithmia.algo_response.AlgoException as e:
            print("Exception ")
            print(e)
    print(response)
    return response


def shuffle_colors(url):
    """Create unique color paletted from images passed in."""
    data = color_extractor(url)
    print(data)
    a_list = []
    for c in data:
        for hex in c["colors"]:
            a_list.append(hex["hex"])

    if len(a_list) == 0:
        print("No valid images found (transparent or JavaScript-generated images)")
    else:
        new_color_scheme = random.sample(set(a_list), 5)
        print(new_color_scheme)

shuffle_colors(
    "http://shop.nordstrom.com/c/designer-collections?origin=topnav&cm_sp=Top%20Navigation-_-Designer%20Collections")
