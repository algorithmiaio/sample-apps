# RSS Dashboard Sample App

Welcome to the RSS Dashboard sample app! You can see a live version of this demo at [RSS Dashboard](https://algorithmia.com/demo/rss).

## Getting started

The RSS Dashboard is a HTML/CSS and JavaScript project with all the dependencies included here. Simply include your API key and open the `rss_dashboard.html` file in your browser of choice to see it work!

### What's included

This app has three main components: The page `rss_dashboard.html`, the JavaScript directory and the CSS directory.

The CSS folder includes bootstrap and a spinner to indicate when the app is running. If you'd like to customize the look of your app, add your additional CSS to the `main.css` file. 

The JavaScript directory two main files: `algorithmia.js` and `main.js`. The first is the [Algorithmia JavaScript Client](http://developers.algorithmia.com/clients/javascript/), which is used to give you a nice interface to make calls to the API. The second is `main.js`, the JavaScript which makes the API calls and handle the responses. This file is full of comments to help explain what's going on and to make the code understandable for beginners and experts alike.

The other files in the JavaScript directory are methods used to make calls into the API as standalone files. While these are not needed to make the dashboard work (the same code can be found inside `main.js`), they are included here to help users building the dashboard from scratch understand each method individually. 

### Authenticate

When you haven't included your API key, when you open the `rss_dashboard.html` file in your browser of choice you should see the following:

![Failed to authenticate](https://raw.githubusercontent.com/algorithmiaio/sample-apps/master/JavaScript/RSS_dashboard/readme_resources/failed_to_authenticate.png)

To make the RSS Dashboard work, we'll need to authenticate. At the very top of `main.js`, you'll see the following lines:
```
window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "YOUR_API_KEY"
```

Be sure to replace `YOUR_API_KEY` with the API key from your Algorithmia account! After you replace the API key, refresh the page. You'll be able to see the dashboard now loading and calling the algorithms that prove the tags, sentiment analysis, and summaries.

## Ready to build your own Algorithmia based app?

Be sure to check out the resources in the [Algorithmia Developer Center](http://developers.algorithmia.com) and the [API docs](http://docs.algorithmia.com) for more!