#!/usr/bin/python

import Algorithmia
import argparse
import posixpath

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--api-key', required=True)
    parser.add_argument('--connector-path', default='dropbox://') # uses the default dropbox connector is none is specified
    args = parser.parse_args()

    # Initialize Algorithmia Python client
    client = Algorithmia.client(args.api_key)

    # Pick Algorithm to use
    algo = client.algo('deeplearning/ColorfulImageColorization/0.1.16')

    top_level_dir = client.dir(args.connector_path)

    # Iterate over regisrered dropbox + folder where my images are.
    for f in top_level_dir.files():

        # Check file if file type is supported.
        if f.getName().lower().endswith(('.png','.jpg','.jpeg','.bmp','.gif')):
            colored_file_name = 'color_' + f.getName()

            # Define input for Algorithm + Parameters
            algo_input = { 'image':    posixpath.join(args.connector_path, f.getName()),
                           'location': posixpath.join(args.connector_path, colored_file_name)}

            print 'Processing {} and saving to {}'.format(f.getName(), colored_file_name)

            # Call Algorithm
            output = algo.pipe(algo_input)
        else:
            print "File: " + f.getName() +  " is not a type that is supported."

    print "Done processing..."

if __name__ == '__main__':
    main()
