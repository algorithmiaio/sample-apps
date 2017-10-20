# Car Make and Model Sample App

This directory contains a sample app to demonstrate bringing an image-based deep learning algorithm using the Algorithmia client in an Android project. You can either play around with the finished code by cloning this repository and opening it in Android Studio, or you can follow along with our [Car Make and Model tutorial](https://algorithmia.com/developers/tutorials/sample-apps/android-car-dl-app/) to build it from scratch.

The algorithm that we'll use in this example is the [Car Make and Model Recognition algorithm](https://algorithmia.com/algorithms/LgoBE/CarMakeandModelRecognition) that a user developed and we productionized on our platform. It brings image recognition to users via a scalable API endpoint so you can bring deep learning applications to your Android projects.

This sample app will show you two screens, the first one displays a button that says "Pic Please" that you will use to take an image (if you're using your Android phone to test instead of the emulator, we suggest taking a picture of a car you find online). After taking an image the app will prompt you to press another button called "Find Make and Model of Car" which will run our algorithm.

## Getting it running

1. Open the project by selecting Open existing project and navigating to this directory. Then select the `build.gradle` file to open the project.

2. Change the default API key to your API key in the string resources file. You will see an entry under `app/res/values/strings.xml` that looks like this: `<string name="algorithmia_api_key">YOUR_API_KEY</string>`. Simply replace the string contents with your API key here. Find your API key by navigating to the Credential section under your profile on Algorithmia.com.

3. Select "Run app" from "run" in the menu bar of Android Studio or use `^R` to launch the app in your emulator or on a device.

4. The app will prompt you to take a picture with the Pic Please button and then will show you another screen when you are done taking your picture that will show a different button that says: Find Make and Model of Car. 

5. Once you press the Find Make and Model of Car button, the app will make a call to the API and algorithm. The results will be shown above the button after a few seconds.


## Next steps

Explore the various algorithms on the marketplace and try replacing the Car Make and Model Recognition algorithm with another image-based algorithm you're interested in. Try something like [Color Scheme Extraction](https://algorithmia.com/algorithms/vagrant/ColorSchemeExtraction) or find out the gender of a person in an image with [Gender Classification](https://algorithmia.com/algorithms/deeplearning/GenderClassification). Then make sure the input you provide to your new algorithm matches the expected input, and hit run! 
