# Basic Android Integration Sample App

This directory contains a sample app to demonstrate a simple integration of the Algorithmia client into an Android project.

The app allows you to specify an algorithm and its input. When you hit the Run button, the app will make a call to the API and algorithm. The results will be shown below the run button.

## Getting it running

1. Open the project by selecting Open existing project and navigating to this directory. Then select the `build.gradle` file to open the project.

2. Change the default API key to your API key in the string resources file. You will see an entry under `app/res/values/strings.xml` that looks like this: `<string name="algorithmia_api_key">simeyUbLXQ/R8Qga/3ZCRGcr2oR1</string>`. Simply replace the string contents with your API key here. Find your API key by navigating to the Credential section under your profile on Algorithmia.com.

3. Select "Run app" from "run" in the menu bar of Android Studio or use `^R` to launch the app in your emulator or on a device.

4. The first field is algorithm that will be called. The app starts with a pre-filled example of `demo/Hello`. The input also comes pre-filled with the example text `foo`. Change `foo` to your name and hit the run button! 

## Next steps

Explore the various algorithms on the marketplace and try replacing `demo/Hello` with one you're interested in. Try something like [anowell/pinky](https://algorithmia.com/algorithms/anowell/pinky) or [diego/RetrieveTweetsWithKeyword](https://algorithmia.com/algorithms/diego/RetrieveTweetsWithKeyword) Then make sure the input you provide to your new algorithm matches the expected input, and hit run! 
