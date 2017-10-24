#!/usr/bin/env bash
# downloads and extracts the openimages bounding box annotations and image path files
mkdir data
wget https://storage.googleapis.com/openimages/2017_07/images_2017_07.tar.gz
tar -xf images_2017_07.tar.gz
mv 2017_07 data/images
rm images_2017_07.tar.gz

wget https://storage.googleapis.com/openimages/2017_07/annotations_human_bbox_2017_07.tar.gz
tar -xf annotations_human_bbox_2017_07.tar.gz
mv 2017_07 data/bbox_annotations
rm annotations_human_bbox_2017_07.tar.gz

wget https://storage.googleapis.com/openimages/2017_07/classes_2017_07.tar.gz
tar -xf classes_2017_07.tar.gz
mv 2017_07 data/classes
rm classes_2017_07.tar.gz