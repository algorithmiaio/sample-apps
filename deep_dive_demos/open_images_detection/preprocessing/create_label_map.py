import argparse

# now we create the pbtxt file, there's no writer for this so we have to make one ourselves


def save_label_map(label_map_path, data):
    with open(label_map_path, 'w+') as f:
        for i in range(len(data)):
            line = "item {\nid: " + str(i + 1) + "\nname: '" + data[i] + "'\n}\n"
            f.write(line)

parser = argparse.ArgumentParser()
parser.add_argument('--trainable_classes_path', dest='trainable_classes', required=True)
parser.add_argument('--class_description_path', dest='class_description', required=True)
parser.add_argument('--label_map_save_path', dest='label_map_path', required=True)

if __name__ == '__main__':
    args = parser.parse_args()
    trainable_classes_file = args.trainable_classes
    class_description_file = args.class_description
    label_map_path = args.label_map_path
    save_label_map(label_map_path, trainable_classes_file)

