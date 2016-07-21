#!/usr/bin/python

# USAGE: python colorize.py --api-key "YOUR_API_KEY" --connector-path "dropbox+NAME://path/to/directory"
# If you get an error with any of the imports, make sure to run `pip install Algorithmia`

import Algorithmia
import argparse
import posixpath

def recursivelyColorize(algo, path, directory):
    # Start by doing all the files
    for f in directory.files():
        # Check file if file type is supported.
        if f.getName().lower().endswith(('.png','.jpg','.jpeg','.bmp','.gif')):
            colored_file_name = 'color_{}'.format(f.getName())

            if not colored_file_name.lower().endswith('.png'):
                colored_file_name += '.png'

            # Define input for Algorithm + Parameters
            algo_input = { 'image':    posixpath.join(path, f.getName()),
                           'location': posixpath.join(path, colored_file_name) }

            print 'Processing {} and saving to {}'.format(f.getName(), colored_file_name)

            # Call Algorithm
            output = algo.pipe(algo_input)
        else:
            print 'File: {} is not a type that is supported.'.format(f.getName())

    for d in directory.dirs():
        recursivelyColorize(algo, posixpath.join(path, d.getName()), d)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--api-key', required=True)
    parser.add_argument('--connector-path', required=True)
    args = parser.parse_args()

    # Initialize Algorithmia Python client
    client = Algorithmia.client(args.api_key)

    # Get the algorithm we plan to use on each picture
    algo = client.algo('deeplearning/ColorfulImageColorization/0.1.16')

    # The root level directory that we will traverse
    top_level_dir = client.dir(args.connector_path)

    # Colorize each file in each sub directory
    recursivelyColorize(algo, args.connector_path, top_level_dir)

    print 'Done processing!'

if __name__ == '__main__':
    main()
