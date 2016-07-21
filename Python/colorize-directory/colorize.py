#!/usr/bin/python
​
import Algorithmia
​
#Set your Algorithmia API KEy
apiKey = 'API KEY HERE'
​
#Initialize Algorithmia Python client
client = Algorithmia.client(apiKey)
​
#Pick Algorithm to use
algo = client.algo('deeplearning/ColorfulImageColorization/0.1.16')
​
#Iterate over regisrered dropbox + folder where my images are.
for f in client.dir("dropbox://stein-Algorithmia/").list():

    #Check file if file type is supported.
    if f.getName().lower().endswith(('.png','.jpg','.jpeg','.bmp','.gif')):
        #Image progress write
        print "Reading " + f.getName()
​
        #Define input for Algorithm + Parameters
        input = {"image":"dropbox://stein-Algorithmia/" + f.getName(),"location":"dropbox://stein-Algorithmia/color_" + f.getName()}

        #Call Algorithm
        output = algo.pipe(input)
        print "Colorizing: color_" + f.getName()

        #client.file('dropbox://Nathan/thumbnail_' + f.getName()).put(output.result)
    else:
        print "File:" + f.getName() +  "is not a type that is supported."
​
print "Done processing..."