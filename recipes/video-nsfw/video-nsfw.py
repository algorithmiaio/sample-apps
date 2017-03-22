import Algorithmia
import math
from moviepy.editor import *
from uuid import uuid4


def detect_nudity(source_uri):
    """Determine what time-ranges of a video contain nudity"""
    algo = client.algo('sfw/VideoNudityDetection/0.1.0')
    algo.set_options(timeout=15*60)
    data = {'source':source_uri}
    return algo.pipe(data).result


def upload_file(local_file):
    """Copy local_file to Algorithmia temporary datastore"""
    video_dir = 'data://.my/videos/'
    client.dir(video_dir).create()
    video_file = video_dir+str(uuid4())
    client.file(video_file).putFile(local_file)
    return video_file


def remove_nsfw(source_file, target_file, threshold=0.5, codec='libx264'):
    """Strip out NSFW sections from source_file and write the cleaned video to target_file """
    print "uploading %s" % source_file
    data_uri = upload_file(source_file)
    print "examining %s" % data_uri
    nsfw_segments = detect_nudity(data_uri)
    print "cleaning %s (threshold=%s)" % (source_file, threshold)
    clip = VideoFileClip(source_file)
    shift = 0
    for segment in nsfw_segments['detections']:
        if segment['average_confidence'] > threshold:
            (start, stop) = (int(segment['start_time']), int(math.ceil(segment['stop_time'])))
            print "removing %s-%s" % (start, stop)
            clip = clip.cutout(start-shift,stop-shift)
            shift += stop-start
    print "writing %s (codec=%s)" % (target_file, codec)
    clip.write_videofile(target_file, codec=codec)
    client.file(data_uri).delete()


# get your API key at algorithmia.com/user#credentials
client = Algorithmia.client('your_api_key')
input_video = 'myfile.mp4'
output_video = 'output.mp4'
threshold = 0.5
codec = 'libx264'
remove_nsfw(input_video, output_video, threshold, codec)