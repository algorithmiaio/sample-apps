# General time series for tutorial

# Zillow data on 30 year fixed loan rates for jumbo mortgages downloaded from data world 
# https://data.world/zillow-data/jumbo-30-year-fixed-mortgage-rates

# Input example:{"h":20, "level": 99.5, "output_arima_plot": "data://demo/zillow_r_mortgage_demo/output_arima_plot.png"} 
library(algorithmia)
library(lubridate)
library(forecast)
library(dplyr)

client <- getAlgorithmiaClient()

load_model <- function(){
    model_path <- "data://YOUR_USERNAME/zillow_r_mortgage_demo/auto_arima_model.rds"
    model <- client$file(model_path)$getFile()
    loaded_model <- readRDS(model, refhook = NULL)
    return(loaded_model)
}

# Load ARIMA fitted model outside of the algorithm function 
# this way the model will be loaded once and subsequent models 
# will load faster
auto_arima_fit <- load_model()

generate_forecast_arima <- function(input){
    user_input <- list(input)
    # h = Number of periods for forecasting
    # level = Confidence level for prediction intervals.
    forecast_arima <- forecast(auto_arima_fit,h=input$h,level=c(input$level))
    return(forecast_arima)
}

create_plot <- function(input){
    forecast_arima <- generate_forecast_arima(input)
    # Create a tmp file to store the plot
    tempFileName <- "output_arima_plot"
    png(filename=tempFileName)
  
    # Plot mortgage forecast time series
    plot <- plot(forecast_arima, col="#00B8D4", lwd=1.25, main="")
    dev.off()
  
    # Move the output file to the proper output location in the Algorithmia data api
    tryCatch({
        str(input$output_arima_plot)
        client$file(input$output_arima_plot)$putFile(tempFileName)
        paste0("Successfully saved the plot to: ", input$output_arima_plot)
        data_files <- toJSON(list("output_plot"=input$output_arima_plot))
        return(data_files)
    }, 
    error = function(e) {
        print("Please check your folder and file paths.")
        stop(e)
    }) 
}

algorithm <- function(input){
    # Create plot showing ARIMA forecast
    create_plot(input)
}
