import Algorithmia

client = Algorithmia.client("YOUR_API_KEY")


def get_images():
    """Create labeled dataset from data collection."""
    image_dir = client.dir("data://your_username/your_data_collection/")
    images = []
    # Retrieve images from data collection.
    for file in image_dir.list():
        if image_dir.exists():
            path = file.path.split('_')
            first_name = file.path.split('_')[2].split('/')[1]
            last_name = path[3]
            # Create label from image name.
            label = first_name + " " + last_name
            # Label image based on celebrity.
            images.append(
                {"url": "data://{0}".format(file.path), "person": label})
        else:
            image_dir.create()
    return images


def facial_recognition_algorithm(input):
    """Call Face Recognition algorithm and pipe input in."""
    algo = client.algo('cv/FaceRecognition/0.2.0')
    return algo.pipe(input)


def train_images():
    """Train images from celebrity pictures."""
    images = get_images()
    input = {"action": "add_images",
             "data_collection": "CelebClassifiers",
             "name_space": "WWCelebrities",
             "images": images
             }

    return facial_recognition_algorithm(input)


def model_predictions():
    """Predict unseen images as a celebrity the model was trained on."""
    input = {
        "name_space": "WWCelebrities",
        "data_collection": "CelebClassifiers",
        "action": "predict",
        "images": [
            {
                "url": "data://your_username/your_data_collection/Anna_Paquin_test.jpg",
                "output": "data://your_username/your_data_collection/Anna_Paquin_test_output.jpg"
            },

            {
                "url": "data://your_username/your_data_collection/Diego_Oppenheimer_1.jpg",
                "output": "data://your_username/your_data_collection/Diego_Oppenheimer_output.jpg"
            },
            {
                "url": "data://your_username/your_data_collection/Kenny_Daniel_1.jpg",
                "output": "data://your_username/your_data_collection/Kenny_Daniel_output.jpg"
            },
            {
                "url": "data://your_username/your_data_collection/Jon_Peck_1.jpg",
                "output": "data://your_username/your_data_collection/Jon_Peck_output.jpg"
            },
            {
                "url": "data://your_username/your_data_collection/Nelsan_Ellis_test.jpg",
                "output": "data://your_username/your_data_collection/Nelsan_Ellis_test_output.jpg"
            }

        ]
    }
    return facial_recognition_algorithm(input)


if __name__ == "__main__":
    train_images()
    model_predictions()
