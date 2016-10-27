install.packages("Algorithmia")
install.packages("stats")

library(algorithmia)
library(stats)

client <- getAlgorithmiaClient("your_api_key")
# This is input for the Sentiment Time Series algorithm
sent_freq <- function(){
  sent_input <- list(input_file="data://username/data_collection_name/time_comments.csv",
      output_plot="data://username/data_collection_name/sent_timeseries_plot.png",
      output_file="data://username/data_collection_name/sent_freq_file.json",
      start=data_start_date,
      end=data_end_date,
      freq=observations_per_season,
      dt_format=date_format,
      tm_zone=timezone)

  # Call the Sentiment Time Series algorithm
  sent_algo <- client$algo("nlp/SentimentTimeSeries/0.1.0")
  # Pipe in sent_input to write the files to your stated directories in output_plot and output_file paths
  sent_algo$pipe(sent_input)$result
}
sent_freq()

restructure_df <- function(sent_tm, results){
  # Map results of forecast with original timestamp
  structure(do.call(rbind.data.frame, Map('c', results, tm=sent_tm)),names=c('forecast_freq','timestamp'))
}

plot_sent_ts <- function(){
  # Extract your data from the JSON file, saving it to a variable called input which is an R list. 
  forecast_input <- client$file("data://.my/testing/sent_freq_file.json")$getJson()
  
  # Call Forecast algorithm and retrieve result for pos, neg, neu sentiment
  algo <- client$algo("TimeSeries/Forecast/0.2.0")

  # Pipe each sentiment frequency input into algor$pipe and retrieve results
  pos_results <- algo$pipe(forecast_input$pos$freq)$result
  neg_results <- algo$pipe(forecast_input$neg$freq)$result
  neu_results <- algo$pipe(forecast_input$neu$freq)$result

  # Map each sentiment result with their corresponding timestamp
  pos_df <- restructure_df(forecast_input, pos_results)
  neg_df <- restructure_df(forecast_input, neg_results)
  neu_df <- restructure_df(forecast_input, neu_results)

  # Creates time series objects
  neu_ts <- ts(neu_df$forecast_freq, start=start(pos_df$timestamp), end=end(pos_df$timestamp))
  pos_ts <- ts(pos_df$forecast_freq, start=start(pos_df$timestamp), end=end(pos_df$timestamp))
  neg_ts <- ts(neg_df$forecast_freq, start=start(pos_df$timestamp), end=end(pos_df$timestamp))

  # Option to plot all three sentiment forecasts on one plot or you can plot only one sentiment at a time
  plot_ts <- ts.plot(pos_ts, neg_ts, neu_ts, gpars = list(col = c("green", "red", "blue")))

  # Return the plot you want to save to your Desktop
  return(plot_ts)
}

plot_forecast <- function(){
  # Create a png object with the filename of your choice
  png(filename="sentiment_forecast.png")
  # Create the plot
  plot_sent_ts()
  # Turn off graphical device
  dev.off()
}
plot_forecast()
