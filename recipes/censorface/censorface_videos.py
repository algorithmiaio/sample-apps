import Algorithmia

client = Algorithmia.client("YOUR_API_KEY")


def scene_detection():
    """Find subclips of videos."""
    input = {
        "video": "https://www.youtube.com/watch?v=CLrkUWWiQ70",
        "threshold": 40,
        "output_collection": "testSceneDetection"
    }
    algo = client.algo('media/SceneDetection/0.1.2').set_options(timeout=1000)
    scene_timestamps = algo.pipe(input).result
    print(scene_timestamps["output_collection_videos"])
    return scene_timestamps["output_collection_videos"]


def nudity_detection():
    """Check for nudity returning json files in data collection."""
    data = scene_detection()
    algo = client.algo("media/VideoMetadataExtraction/0.4.2")
    for video_file in data:
        output_file_name = video_file.split('/')[-1].split('.')[0]
        input = {
            "input_file": video_file,
            "output_file": "data://.algo/temp/{0}.json".format(output_file_name),
            "algorithm": "algo://sfw/nuditydetectioni2v"
        }
        algo.pipe(input).result
    print(data)
    return data


def safe_videos():
    """For video clips check if they are nude and return non-nude clips."""
    image_dir = client.dir("data://.algo/media/VideoMetadataExtraction/temp/")
    clips = nudity_detection()
    if image_dir.exists():
        safe_clips = []
        for file in image_dir.list():
            file_contents = client.file(file.path).getJson()
            nude_list = [f["data"]["nude"]
                         for f in file_contents["frame_data"]]
            # Check to see if there is nudity in clip
            if True not in nude_list:
                clean_file = file.path.split('/')[-1].split('.')[0]
                for cf in clips:
                    if clean_file in cf:
                        # Return only the safe video clip paths
                        safe_clips.append(cf)
        return safe_clips


def censor_video():
    """For any non-nude clips censor the faces."""
    algo = client.algo(
        "media/VideoTransform/0.5.5")
    for video_file in safe_videos():
        print(video_file)
        input = {
            "input_file": video_file,
            "output_file": "data://quality/testCensorface/testCensor.mp4",
            "algorithm": "cv/CensorFace/0.1.3",
            "advanced_input": {
                "images": "$BATCH_INPUT",
                "output_loc": "$BATCH_OUTPUT",
                "fill_color": "blur"
            }
        }
        response = algo.pipe(input).result
        print(response)

censor_video()
