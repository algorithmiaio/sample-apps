import Algorithmia
import math
from datetime import datetime
from moviepy.editor import *


def extract_metadata(source_uri):
    """Determine what time-ranges of a video contain nudity"""
    algo = client.algo('sfw/VideoNudityDetection/0.1.0')
    algo.set_options(timeout=15*60)
    data = {'source':source_uri}
    return algo.pipe(data).result


def upload_file(local_file):
    """Copy local_file to Algorithmia temporary datastore"""
    video_dir = 'data://.my/videos/'
    client.dir(video_dir).create()
    video_file = video_dir+str(datetime.now().microsecond)
    client.file(video_file).putFile(local_file)
    return video_file


def remove_nsfw(source_file, target_file, threshold=0.5, codec='libx264'):
    """Strip out NSFW sections from source_file and write the cleaned video to target_file """
    print "uploading %s" % source_file
    data_uri = upload_file(source_file)
    print "examining %s" % data_uri
    nsfw_segments = extract_metadata(data_uri)
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

# result = {'detections':[{'average_confidence':0.3236572316782259,'start_time':1.6229981521739132,'stop_time':2.9213966739130437},{'average_confidence':0.13879965838277722,'start_time':3.245996304347827,'stop_time':3.5705959347826086},{'average_confidence':0.1702812343894039,'start_time':6.167392978260869,'stop_time':6.8165922391304345},{'average_confidence':0.46762026507640286,'start_time':7.141191869565216,'stop_time':7.465791500000001},{'average_confidence':0.9650805749243591,'start_time':7.7903911304347835,'stop_time':9.413389282608698},{'average_confidence':0.5890913993091089,'start_time':9.737988913043477,'stop_time':10.062588543478265},{'average_confidence':0.7397092220286147,'start_time':10.387188173913044,'stop_time':10.711787804347827},{'average_confidence':1,'start_time':11.036387434782611,'stop_time':11.360987065217394},{'average_confidence':0.14343336627644027,'start_time':11.685586695652177,'stop_time':12.334785956521742},{'average_confidence':0.1844407251279336,'start_time':12.659385586956523,'stop_time':12.983985217391307},{'average_confidence':1,'start_time':13.308584847826092,'stop_time':13.633184478260869}]}