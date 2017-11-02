import csv
import argparse
import json


def translate_class_descriptions(trainable_classes_file, descriptions_file):
    with open(trainable_classes_file, 'rb') as file:
        trainable_classes = file.read().replace(' ', '').split('\n')
    description_table = {}
    with open(descriptions_file) as f:
        for row in csv.reader(f):
            if len(row):
                description_table[row[0]] = row[1].replace("\"", "").replace("'", "").replace('`', '')
    output = []
    for elm in trainable_classes:
        if elm != '':
            output.append(description_table[elm])
    return output


def save_classes(formatted_data, translated_path):
    with open(translated_path, 'w+') as f:
        json.dump(formatted_data, f)

parser = argparse.ArgumentParser()
parser.add_argument('--trainable_classes_path', dest='trainable_classes', required=True)
parser.add_argument('--class_description_path', dest='class_description', required=True)
parser.add_argument('--trainable_translated_path', dest='trainable_translated_path', required=True)


if __name__ == '__main__':
    args = parser.parse_args()
    trainable_classes_path = args.trainable_classes
    description_path = args.class_description
    translated_path = args.trainable_translated_path
    translated = translate_class_descriptions(trainable_classes_path, description_path)
    save_classes(translated, translated_path)

