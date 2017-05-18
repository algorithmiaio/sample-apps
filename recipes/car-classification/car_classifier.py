import Algorithmia
client = Algorithmia.client("YOUR_API_KEY")

def get_make_model():
    video_file = "data://quality/testing/BusStation-6094.mp4"
    algo = client.algo("media/VideoMetadataExtraction/0.4.2")
    input = {
        "input_file": video_file,
        "output_file": "data://.algo/temp/bus_video_car_detection.json",
        "algorithm": "LgoBE/CarMakeandModelRecognition/0.3.4",
        "advanced_input": {
            "image": "$SINGLE_INPUT"
        }
    }
    algo.pipe(input).result
get_make_model()


def get_json_file():
    video_file = "data://.algo/media/VideoMetadataExtraction/temp/bus_video_car_detection.json"
    if client.file(video_file).exists() is True:
        # Get JSON file from data collections
        data = client.file(video_file).getJson()
        # Get only highest confidence
        item_list = [record["data"][0] for record in data["frame_data"]]
        # Return only unique records by make of car
        unique_items = [{v["make"]: v for v in item_list}.values()]
        print(unique_items)
get_json_file()
