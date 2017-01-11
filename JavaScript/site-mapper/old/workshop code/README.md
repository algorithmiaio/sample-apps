# RSS Dashboard Workshop

Welcome to the RSS Dashboard Workshop! Here you will find the code you need to build your own RSS Dashboard. 

![RSS Dashboard](https://raw.githubusercontent.com/algorithmiaio/sample-apps/master/JavaScript/RSS_dashboard/readme_resources/final_dashboard.png)

## Getting started

The RSS Dashboard is a HTML/CSS and JavaScript project with all the dependencies included here. 

### What's included

This app has three main components: The page `rss_dashboard.html`, the JavaScript directory and the CSS directory.

The CSS folder includes bootstrap and a spinner to indicate when the app is running. If you'd like to customize the look of your app, add your additional CSS to the `main.css` file. 

The JavaScript directory has two files: `algorithmia.js` and `main.js`. The first is the [Algorithmia JavaScript Client](http://developers.algorithmia.com/clients/javascript/), which is used to give you a nice interface to make calls to the API. The second is `main.js`, the JavaScript skeleton that outlines how this RSS Dashboard will make the API calls and handle the responses. This file is full of comments to help explain what's going on and to make the code understandable for beginners and experts alike.

### The base app

To see what we've already prepared, go ahead and open the `rss_dashboard.html` file in your browser of choice. You should see the following:

![Failed to authenticate](https://raw.githubusercontent.com/algorithmiaio/sample-apps/master/JavaScript/RSS_dashboard/readme_resources/failed_to_authenticate.png)

This is the base of the RSS Dashboard that we will build out. The first think we'll fix is that handy authentication error you see!

## Building out the app

To make the RSS Dashboard work, we'll need to authenticate, fill out the JavaScript to make the rest of the API calls, and display the results in the HTML. Let's get started!

### Authenticate

At the very top of `main.js`, you'll see the following lines:
```
window.Algorithmia = window.Algorithmia || {};
Algorithmia.api_key = "YOUR_API_KEY"
```

Be sure to replace `YOUR_API_KEY` with the API key from your Algorithmia account! After you replace the API key, refresh the page. You'll be able to see the dashboard now loading and calling the algorithms that are already filled out for you. This will result in the top 6 results from the selected feed displayed as just their titles, like so:

![Authenticated](https://raw.githubusercontent.com/algorithmiaio/sample-apps/master/JavaScript/RSS_dashboard/readme_resources/authenticated.png)

### Make some API calls

As you can see in `main.js`, lines 84 - 104 have empty methods that need to be filled out. These are the methods that we'll use to make calls to the Algorithmia API to do the autotagging, sentiment analysis, and summarization. 

You should see the following:
```
function autotag(itemText, tagsElement) {
// Fill me in!
// https://algorithmia.com/algorithms/nlp/AutoTag
}
```

You can make the call to the API inside the method where it says "Fill me in!". Additionally, you'll find the URL to the profile page for each of the algorithms so that you can read more about what they do and what types of input and output to expect. 

### Customize

You can of course customize the default sites you see in the dropdown. Simply replace the samples at lines 30 - 36 of `rss_dashboard.html`:

```
<!-- Replace these with links to your favorite RSS feeds -->
<option value="https://news.ycombinator.com/rss">HackerNews</option>
<option value="http://feeds.feedburner.com/codinghorror">Coding Horror</option>
<option value="https://www.reddit.com/r/programming/.rss">r/programming</option>
<option value="http://www.alistapart.com/feed/rss.xml">A List Apart</option>
<option value="http://www.nytimes.com/services/xml/rss/nyt/Technology.xml">NYT Technology</option>
<option value="http://blog.algorithmia.com/rss">Algorithmia Blog</option>
```

You can also add in new CSS to `main.css` to change the look of your dashboard to fit your style.

## Feeling stuck?

If you're feeling stuck with the dashboard, be sure to check out the resources in the [Algorithmia Developer Center](http://developers.algorithmia.com) and the [API docs](http://docs.algorithmia.com).

You can also take a peek at the completed code directory. Inside the completed code, under the javascript directory, you'll find the entire `main.js` file filled out. If you are just stuck on one of the API calls and want a hint without revealing the whole thing, just look at the individual files named after their method. This will show you just the final code for that method alone, allowing you to unblock yourself and keep moving forward one step at a time.