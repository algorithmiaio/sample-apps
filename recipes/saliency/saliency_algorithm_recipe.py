import Algorithmia

client = Algorithmia.client("your_api_key")

def sharpen_image(path_dict):
    # Pass in your image path hosted on Algorithmia platform
    input = {
        "image": path_dict["sharpen_input_path"],
        "location": path_dict["sharpen_output_path"]
    }
    algo = client.algo("opencv/SharpenImage/0.1.10")
    try:
        result = algo.pipe(input).result
        print(result)
        # Return the image path for the sharpened image
        return result["output"]
    except Exception as e:
        print(e)

def salnet(path_dict):
    new_image_file = sharpen_image(path_dict)
    # Make sure image exists in temporary folder
    if client.file(new_image_file).exists() is True:
        # Get the file name of sharpened image
        file_name = new_image_file.split("/")[-1]
        input = {
            "image": new_image_file,
            "location": "data://.algo/temp/salnet-{0}".format(file_name)
        }
        algo = client.algo('deeplearning/SalNet/0.2.0')
        result = algo.pipe(input).result
        print(result)
        return result
    else:
        print("Please make sure your file path is correct.")

salnet({"sharpen_input_path": "data://your_username/your_data_collection_name/gilligan-guys.jpg",
 "sharpen_output_path": "data://your_username/your_data_collection_name/gilligan-guys-sharpened.jpg"})
