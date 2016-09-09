import Algorithmia


#Set your Algorithmia API Key
apiKey = 'YOUR API KEY GOES HERE'

#Initialize Algorithmia Python client
client = Algorithmia.client(apiKey)

#Pick Algorithm to use
algo = client.algo('opencv/SmartThumbnail/1.0.4')

#Set folder URI path
uri = "s3://myimageassets"

#Iterate over folder containing images in S3 
for f in client.dir(uri).list():
	
	#Check file type is an image
	if f.getName().lower().endswith(('.png','.jpg','.jpeg','.bmp','.gif')):
		#Image progress write
		print "Reading " + f.getName()

		#Define input for Algorithm + Parameters 
		input = [uri + '/' + f.getName(), uri + '/thumbnail_' + f.getName(), 300, 300, "FALSE"]
		
		#Call Algorithm
		output = algo.pipe(input)
		
		print "Thumbnailing: thumbnail_" + f.getName()
        
	else:
		print "File:" + f.getName() +  "is not a type that is supported."

print "Done processing..."