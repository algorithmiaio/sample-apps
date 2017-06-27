# Build a Sentiment Timeseries Forecasting Pipeline

Time series forecasting algorithms are a common method for predicting future values based on historical data using sequential data, such as snowfall per hour, customer sign-ups per day, or quarterly sales data.

In this R recipe, we’ll show how to easily link algorithms together to create a data analysis pipeline for sentiment time series forecasting.

For the full blog post related to this recipe, see [Forecasting Sentiment Analyis with R](http://blog.algorithmia.com/forecast-sentiment-analysis-with-r/).

## Getting Started

Install the [Algorithmia package](https://cran.r-project.org/web/packages/algorithmia/index.html) and [stats library](https://cran.r-project.org/web/packages/dlstats/index.html) from CRAN, and load them in your R environment:

```
install.packages("Algorithmia")
install.packages("stats")

library(algorithmia)
library(stats)
```

You’ll also need a free Algorithmia account, which includes 5,000 free credits a month.

Sign up [here](https://algorithmia.com/), and then grab your [API key](algorithmia.com/user#credentials).

Find this line in the script: 

```
client <- getAlgorithmiaClient("YOUR_API_KEY")
```
and add in your API key.

## How to Analyze Timeseries Sentiment

After putting in your own API key to the line above run it in your console environment:

```Rscript sent_forecast.R```

## Built With
* [Algorithmia](https://algorithmia.com/)
* [Sentiment Timeseries](https://algorithmia.com/algorithms/nlp/SentimentTimeSeries)
* [Forecast](https://algorithmia.com/algorithms/TimeSeries/Forecast)
