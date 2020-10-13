# Track Economic Development

## Analyze open data using predictive time series analysis

This is a demo of several of Algorithmia's open-data extraction and time-series analysis tools, including:
* [Socrata Open Data Query](https://algorithmia.com/algorithms/marksskram/SocrataOpenDataQuery) - pulls the permit data from Socrata
* [Simple Moving Average](https://algorithmia.com/algorithms/timeseries/SimpleMovingAverage) - uses local average to smooth data
* [Linear Detrend](https://algorithmia.com/algorithms/timeseries/LinearDetrend) - removes increasing or decreasing trends in time series
* [Autocorrelate](https://algorithmia.com/algorithms/timeseries/AutoCorrelate) - used to analyze the seasonality of a time series
* [Remove Seasonality](https://algorithmia.com/algorithms/timeseries/RemoveSeasonality) - removes known seasonal effects from a time series
* [Outlier Detection](https://algorithmia.com/algorithms/timeseries/OutlierDetection) - flags unusual data points
* [Forecast](https://algorithmia.com/algorithms/timeseries/Forecast) - predict a given time series into the future

With this demo, one can analyze Socrata Open Data; forecast, auto-correlate, and detect outliers; and filter the data with seasonality and detrending.  

## See this demo in action

This demo can be viewed at https://demos.algorithmia.com/timeseries

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).
1. download the repository
2. edit **/JavaScript/timeseries/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples)) in the line containing "Algorithmia.client()"
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:timeseries`
6. open **/build/timeseries/index.html** in a web browser

Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).
