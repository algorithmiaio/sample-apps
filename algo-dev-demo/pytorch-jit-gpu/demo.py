import Algorithmia
from PIL import Image
import torch
import torchvision.transforms as transforms

client = Algorithmia.client()
classes = ('plane', 'car', 'bird', 'cat',
           'deer', 'dog', 'frog', 'horse', 'ship', 'truck')

def preprocessing(image_path):
    image_file = client.file(image_path).getFile().name
    # Normalize and resize image
    normalize = transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    preprocess = transforms.Compose(
        [transforms.Resize((32, 32)),
         transforms.ToTensor(), normalize])
    img = Image.open(image_file)
    img.load()
    output = preprocess(img)
    return(output)

def load_model():
    file_path = "data://YOUR_USERNAME/YOUR_DATACOLLECTION/demo_model.t7"
    model_file = client.file(file_path).getFile().name
    return torch.jit.load(model_file).cuda()

model = load_model()

def predict(image):
    image_tensor = image.unsqueeze_(0).float().cuda()
    # Predict the class of the image
    outputs = model(image_tensor)
    _, predicted = torch.max(outputs, 1)
    return predicted

# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages
def apply(input):
    # "data://YOUR_USERNAME/YOUR_DATACOLLECTION/sample_plane1.jpg"
    processed_data = preprocessing(input)
    prediction = predict(processed_data)
    predictions = [classes[prediction[j]] for j in range(1)]
    return "Predicted class is:  {0}".format(predictions)
