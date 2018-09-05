library(algorithmia)
library(e1071)

client <- getAlgorithmiaClient()

read_data <- function(file_path) {
  # Use data api to process data passed in as user input
  csv_file <- client$file(file_path)$getFile()
  csv_data <- read.csv(csv_file,  stringsAsFactors=FALSE, check.names=FALSE, header=TRUE)
  return(csv_data)
}

load_model <- function() {
    # Load model that was saved as .rds file from data collections
    file_path <- "data://demo/iris_r_demo/naive_bayes_iris.rds"
    rds_file <- client$file(file_path)$getFile()
    loaded_model <- readRDS(rds_file, refhook = NULL)
    return(loaded_model)
}

# Load model outside of algorithm function - this way after the model is first
# loaded, subsequent calls will be much faster
model <- load_model()

prediction <- function(data) {
    # Using pre-trained Naive Bayes model make predictions on user data
    iris_pred_naive <- predict(model, data)
    return(iris_pred_naive)
}

# API calls will begin at the algorithm() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages
algorithm <- function(input) {
    example_data <- read_data(input)
    predictions <- prediction(example_data)
    return(predictions)
}
