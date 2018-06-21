#!/usr/bin/python

# USAGE: python colorize.py --api-key "YOUR_API_KEY" --connector-path "dropbox+NAME://path/to/directory" [--recursive]
# If you get an error with any of the imports, make sure to run `pip install Algorithmia`

import Algorithmia
import argparse
import posixpath

def colorizeFilesInDirectory(algo, path, directory):
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

            try:
                # Call Algorithm
                output = algo.pipe(algo_input)
            except Exception:
                print '  Failed to process {}. Skipping...'.format(f.getName())
        else:
            print 'File: {} is not a type that is supported.'.format(f.getName())

def recursivelyColorize(algo, path, directory):
    # Start by doing all the files
    colorizeFilesInDirectory(algo, path, directory)

    for d in directory.folders():
        recursivelyColorize(algo, posixpath.join(path, d.getName()), d)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--api-key', required=True, help='algorithmia api key')
    parser.add_argument('--connector-path', required=True, help='s3 or dropbox path for the directory to scan')
    parser.add_argument('--recursive', action='store_true', help='continue scanning all sub-directories of the connector path')
    args = parser.parse_args()

    # Initialize Algorithmia Python client
    client = Algorithmia.client(args.api_key)

    # Get the algorithm we plan to use on each picture
    algo = client.algo('deeplearning/ColorfulImageColorization/1.0.1')
    algo.set_options(timeout=600) # This is a slow algorithm, so let's bump up the timeout to 10 minutes

    # The root level directory that we will traverse
    top_level_dir = client.dir(args.connector_path)

    # Colorize the files
    if args.recursive:
        recursivelyColorize(algo, args.connector_path, top_level_dir)
    else:
        colorizeFilesInDirectory(algo, args.connector_path, top_level_dir)

    print 'Done processing!'

if __name__ == '__main__':
    main()
