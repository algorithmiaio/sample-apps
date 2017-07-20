# Restyle images via the Style Thief microservice

The [Style Thief microservice](https://algorithmia.com/algorithms/bkyan/StyleThief) allows you to take one image and stylize it to look like another.

For the full blog post related to this recipe, see http://blog.algorithmia.com

## Before you Begin

1. You'll need a free [Algorithmia account](https://algorithmia.com/signup)

## Set up an Amazon S3 Bucket to Host your Results

1. Go to https://console.aws.amazon.com/s3 and click "Create bucket"
2. Give it any name & location you prefer; **write down the name of the bucket**, then click "Next"
3. You don't need to add versioning, logging, or tags, so click "Next" again
4. In the permissions, select "grant public read access to this bucket", and save

## Get your Secret Access Keys from Amazon
1. Go to https://console.aws.amazon.com/iam/home, click "Users", then "Add User"
2. Pick any name
3. **ONLY** check "Programmatic Access"; click "Next"
4. Click "Attach existing policies directly" and search for "s3"
5. Select "AmazonS3FullAccess"; click "Next", then "Create User
6. Copy "Access Key ID" and "Secret Access Key" (**do this _now_ since they won't be shown again)**; you can also click "Download .csv File" to save a copy

## Create a Data Connector from Algorithmia to S3
1. Go to https://algorithmia.com/data and click "Add Data Source", then pick "Amazon S3"
2. Enter any label you like
3. Paste in the AWS "Access Key ID" and "Secret Access Key" from the "**Get your Secret Access Keys**" step
4. In Path Restriction, paste the name of the bucket from the "**Set up an Amazon S3 Bucket**" step, followed by "/*" (like "bucketname/*")
5. Check "allow writing" (**important!**)
6. **Copy** the URI from the bottom of the dialog, except for the "*" (something like "s3+labelname://bucketname/") and click "Connect Amazon S3" to save
7. Click the "Manage Amazon S3" button under your new connector and UNcheck "make this the default"; save it again
8. To test your connector, head over to https://algorithmia.com/algorithms/util/Cat, scroll down to the "Type Your Input" box and paste your connector (E.G. "s3+labelname://bucketname/"); if clicking Run gives an error, it isn't hooked up properly


## Edit and Run the Demo

1. Edit style-thief.js and replace `your_api_key` with your [Algorithmia API Key](http://developers.algorithmia.com/basics/customizing-api-keys/)
2. Open style-thief.htm in a web browser

## Notes

This demo directly *includes* the Algorithmia JavaScript library from https://algorithmia.com/v1/clients/js/algorithmia-0.2.0.js, but you can also choose to [download you own copy](https://algorithmia.com/developers/clients/javascript/)

## Built With

* [Algorithmia](https://algorithmia.com)
* [Style Thief microservice](https://algorithmia.com/algorithms/bkyan/StyleThief)

