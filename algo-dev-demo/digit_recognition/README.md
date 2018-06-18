#### Before you begin
1. Create an account on [algorithmia.com](https://algorithmia.com/)

#### Upload your model
1. Download `digit_classifier.pickle` from this repository
2. Click "Data" in the header nav at [algorithmia.com](https://algorithmia.com/), then click "[My Hosted Data](https://algorithmia.com/data/hosted)"
3. Click "Add Collection" on the left; name it "demo"
4. Upload `digit_classifier.pickle` via the "Drop files here to upload" box
5. copy the URI which appears below the filename (e.g. `data://username/demo/digit_classifier.pickle`)

#### Create your algorithm
1. Click the "+" on [algorithmia.com](https://algorithmia.com/) to create a new algorithm
2. Give your algorithm any name, pick "Python 2", "Full access to internet", "Can call other algorithms", and "Advanced GPU" -- then click Create Algorithm
3. Click "Algorithmia Web IDE" in the subscript near the bottom of the popup
4. Copy-and-paste the content of `algo.py` into the code editor, replacing the default code
5. In the code, replace `data://username/demo/digit_classifier.pickle` with the URI you copied earlier
6. Click the Dependencies button and paste the content of `requirements.txt`, replacing the default content
7. Click compile and wait for the indicator to stop spinning
8. Paste `"https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/digit_recognition/images/digit_4.png"` (**including** the quotes) into the console below the editor and press Enter

#### LICENSE
BSD

#### CREDIT
adapted from
[guillaume-chevalier/scikit-learn-digit-recognition](https://github.com/guillaume-chevalier/scikit-learn-digit-recognition)