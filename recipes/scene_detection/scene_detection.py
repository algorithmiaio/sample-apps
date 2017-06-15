import statistics
from pytimeparse.timeparse import timeparse
import matplotlib.mlab as mlab
import matplotlib.pyplot as plt
import Algorithmia

client = Algorithmia.client("YOUR_API_KEY")


def scene_detection():
	"""Extract scenes from videos and return timestamps."""
    input = {
        "video": "https://www.youtube.com/watch?v=OMgIPnCnlbQ",
        "output_collection": "testSceneDetection"
    }
    algo = client.algo('media/SceneDetection/0.1.2').set_options(timeout=600)
    scene_timestamps = algo.pipe(input).result
    print(scene_timestamps["scenes"])
    return scene_timestamps["scenes"]


def get_stats():
	"""Get statistics from scene timestamps and return time duration."""
    scenes = scene_detection()
    # Turn time string into a float
    timestamps = [timeparse(timestr) for timestr in scenes]
    print(timestamps)
    # Find the difference between timestamps
    scene_duration = [round(abs(t - i), 1)
                      for i, t in zip(timestamps, timestamps[1:])]
    print(scene_duration)
    # return metadata and statistics about scene length
    maximum_scene_length = max(scenes)
    minimum_scene_length = min(scenes)
    median = statistics.median(scene_duration)
    mode = statistics.mode(scene_duration)
    mean = round(statistics.mean(scene_duration), 1)
    variance = round(statistics.variance(scene_duration, mean), 1)
    print("The mean {0}, The median is {1}, the mode is {2}, and the variance is {3}. The shortest length of a clip is {4} while the longest is {5}".format(
        mean, median, mode, variance, minimum_scene_length, maximum_scene_length))
    return scene_duration


def create_plot():
	"""Create a plot using scene duration."""
	data = get_stats()
	fig = plt.figure()
    ax = plt.subplot(111)
    ax.plot(data)
    plt.xlabel('Subclip index')
    plt.ylabel('Scene Length')
    # Create data plot
    fig.savefig(
        'your_local_file_path/plot.png')
    # Save plot to Algorithmia Hosted Data
    client.file("data://YOUR_USERNAME/YOUR_DATA_COLLECTION_NAME/plot.png").putFile(
        "your_local_file_path/plot.png")

create_plot() 
