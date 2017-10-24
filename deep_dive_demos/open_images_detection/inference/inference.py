import numpy as np
import tensorflow as tf
from PIL import Image
import Algorithmia
import os
import multiprocessing
from . import label_map_util
# This is code for most tensorflow object detection algorithms
# In this example it's tuned specifically for our open images data example.

client = Algorithmia.client()
TEMP_COLLECTION = 'data://.session/'
BOUNDING_BOX_ALGO = 'util/BoundingBoxOnImage/0.1.x'
SIMD_ALGO = "util/SmartImageDownloader/0.2.14"
MODEL_FILE = "data://zeryx/openimagesDemo/ssd.pb"
LABEL_FILE = "data://zeryx/openimagesDemo/label_map.pbtxt"
NUM_CLASSES = 545


class AlgorithmError(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)


def load_model():
    path_to_labels = client.file(LABEL_FILE).getFile().name
    path_to_model = client.file(MODEL_FILE).getFile().name
    detection_graph = tf.Graph()
    with detection_graph.as_default():
        od_graph_def = tf.GraphDef()
        with tf.gfile.GFile(path_to_model, 'rb') as fid:
            serialized_graph = fid.read()
            od_graph_def.ParseFromString(serialized_graph)
            tf.import_graph_def(od_graph_def, name='')
    label_map = label_map_util.load_labelmap(path_to_labels)
    categories = label_map_util.convert_label_map_to_categories(
        label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
    category_index = label_map_util.create_category_index(categories)
    return detection_graph, category_index


def load_labels(label_path):
    label_map = label_map_util.load_labelmap(label_path)
    categories = label_map_util.convert_label_map_to_categories(
        label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
    category_index = label_map_util.create_category_index(categories)
    return category_index


def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape(
      (im_height, im_width, 3)).astype(np.uint8)


def get_image(url):
    output_url = client.algo(SIMD_ALGO).pipe({'image': str(url)}).result['savePath'][0]
    temp_file = client.file(output_url).getFile().name
    os.rename(temp_file, temp_file + '.' + output_url.split('.')[-1])
    return temp_file + '.' + output_url.split('.')[-1]


def generate_gpu_config(memory_fraction):
    config = tf.ConfigProto()
    # config.gpu_options.allow_growth = True
    config.gpu_options.per_process_gpu_memory_fraction = memory_fraction
    return config


# This function runs a forward pass operation over the frozen graph,
# and extracts the most likely bounding boxes and weights.
def infer(graph, image_path, category_index, min_score, output):
    with graph.as_default():
        with tf.Session(graph=graph, config=generate_gpu_config(0.6)) as sess:
            image_np = load_image_into_numpy_array(Image.open(image_path).convert('RGB'))
            height, width, _ = image_np.shape
            image_np_expanded = np.expand_dims(image_np, axis=0)
            image_tensor = graph.get_tensor_by_name('image_tensor:0')
            boxes = graph.get_tensor_by_name('detection_boxes:0')
            scores = graph.get_tensor_by_name('detection_scores:0')
            classes = graph.get_tensor_by_name('detection_classes:0')
            num_detections = graph.get_tensor_by_name('num_detections:0')
            (boxes, scores, classes, num_detections) = sess.run(
                [boxes, scores, classes, num_detections],
                feed_dict={image_tensor: image_np_expanded})
            boxes = np.squeeze(boxes)
            classes = np.squeeze(classes).astype(np.int32)
            scores = np.squeeze(scores)
    for i in range(len(boxes)):
        confidence = float(scores[i])
        if confidence >= min_score:
            ymin, xmin, ymax, xmax = tuple(boxes[i].tolist())
            ymin = int(ymin * height)
            ymax = int(ymax * height)
            xmin = int(xmin * width)
            xmax = int(xmax * width)
            class_name = category_index[classes[i]]['name']
            output.append(
                {
                    'coordinates': {
                                   'y0': ymin,
                                   'y1': ymax,
                                   'x0': xmin,
                                   'x1': xmax
                               },
                    'label': class_name,
                    'confidence': confidence
                }
            )


def draw_boxes_and_save(image, output_path, box_data):
    request = {}
    remote_image = TEMP_COLLECTION + image.split('/')[-1]
    temp_output = TEMP_COLLECTION + '1' + image.split('/')[-1]
    client.file(remote_image).putFile(image)
    request['imageUrl'] = remote_image
    request['imageSaveUrl'] = temp_output
    request['style'] = 'basic'
    boxes = []
    for box in box_data:
        coords = box['coordinates']
        coordinates = {'left': coords['x0'], 'right': coords['x1'],
                       'top': coords['y0'], 'bottom': coords['y1']}
        text_objects = [{'text': box['label'], 'position': 'top'},
                       {'text': 'score: {}%'.format(box['confidence']), 'position': 'bottom'}]
        boxes.append({'coordinates': coordinates, 'textObjects': text_objects})
    request['boundingBoxes'] = boxes
    temp_image = client.algo(BOUNDING_BOX_ALGO).pipe(request).result['output']
    local_image = client.file(temp_image).getFile().name
    client.file(output_path).putFile(local_image)
    return output_path


def apply(input):
    output_path = None
    min_score = 0.50
    if isinstance(input, str):
        image = get_image(input)
    elif isinstance(input, dict):
        if 'image' in input and isinstance(input['image'], str):
            image = get_image(input['image'])
        else:
            raise Exception("AlgoError3000: 'image' missing from input")
        if 'output' in input and isinstance(input['output'], str):
            output_path = input['output']
        if 'min_score' in input and isinstance(input['min_score'], float):
            min_score = input['min_score']
    else:
        raise AlgorithmError("AlgoError3000: Invalid input")
    manager = multiprocessing.Manager()
    box_output = manager.list()
    p = multiprocessing.Process(target=infer,
                                args=(GRAPH, image, CAT_INDEX,
                                      min_score, box_output))
    p.start()
    p.join()
    box_output = [x for x in box_output]
    box_output = sorted(box_output, key=lambda k: k['confidence'])
    if output_path:
        path = '/tmp/image.' + output_path.split('.')[-1]
        im = Image.open(image).convert('RGB')
        im.save(path)
        image = draw_boxes_and_save(path, output_path, box_output)
        return {'boxes': box_output, 'image': image}
    else:
        return {'boxes': box_output}

GRAPH, CAT_INDEX = load_model()
