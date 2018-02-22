#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(ggplot2)
library(algorithmia)

# Define UI for application that draws a histogram
ui <- fluidPage(
   
   # Application title
   titlePanel("NY Births with Fourier Detrend"),
   
   # Sidebar with a slider input for number of bins 
   sidebarLayout(
      sidebarPanel(
         sliderInput("bins",
                     "K strongest frequencies:",
                     min = 1,
                     max = 10,
                     value = 2)
      ),
      
      # Show a plot of the generated distribution
      mainPanel(
         plotOutput("distPlot")
      )
   )
)

fourier_detrend <- function(x) {
  client <- getAlgorithmiaClient("YOUR_API_KEY")
  algo <- client$algo("TimeSeries/FourierDetrend/0.1.0")
  result <- algo$pipe(x)$result
}

# Define server logic required to draw plot
server <- function(input, output) {
  births <- scan("http://robjhyndman.com/tsdldata/data/nybirths.dat")
  # Update the plot based on UI slider
  update_plot = reactive({
    data_input <- list(as.list(births), input$bins)
    return(unlist(fourier_detrend(data_input)))
  })
  
   output$distPlot <- renderPlot({
     detrend_data <- update_plot()
     dbl <- ts(detrend_data, frequency=12, start=c(1946,1))
     autoplot(dbl, ts.colour = "#00B8D4")
   })
}

# Run the application 
shinyApp(ui = ui, server = server)

