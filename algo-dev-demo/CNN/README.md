#### Before you begin
1. Create an account on [algorithmia.com](https://algorithmia.com/)

#### Upload your model
1. Download `simplecnn.pt` from this repository
1. Click "Data" in the header nav at [algorithmia.com](https://algorithmia.com/), then click "[My Hosted Data](https://algorithmia.com/data/hosted)"
1. Click "Add Collection" on the left; name it "demo"
1. Upload `simplecnn.pt` via the "Drop files here to upload" box
1. copy the URI which appears below the filename (e.g. `data://username/demo/simplecnn.pt`)

#### Create your algorithm
1. Click the "+" on [algorithmia.com](https://algorithmia.com/) to create a new algorithm
1. Give your algorithm any name, pick "Python 2" (leave all other options unchanged), and click Create Algorithm
1. Click "Algorithmia Web IDE" in the subscript near the bottom of the popup
1. Copy-and-paste the content of `apply.py` into the code editor, replacing the default code
2. In the code, replace `data://username/demo/simplecnn.pt` with the URI you copied earlier 
1. Click the Dependencies button and paste the content of requirements.txt, replacing the default content
1. Click compile and wait for the indicator to stop spinning
3. Paste `"https://github.com/algorithmiaio/sample-apps/raw/master/algo-dev-demo/CNN/images/bird.jpg"` (**including** the quotes) into the console below the editor and press Enter
