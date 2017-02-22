import Algorithmia

client = Algorithmia.client(YOUR_API_KEY)

docslist = [
    "Machine Learning is Fun Part 5: Language Translation with Deep Learning and the Magic of Sequences",
    "Paddle: Baidu's open source deep learning framework",
    "An overview of gradient descent optimization algorithms",
    "Create a Chatbot for Telegram in Python to Summarize Text",
    "Image super-resolution through deep learning",
    "World's first self-driving taxis debut in Singapore",
    "Minds and machines: The art of forecasting in the age of artificial intelligence"
]

# The LDA required input using a list of documents
lda_input = {
    "docsList": docslist
}

# LDA algorithm: https://algorithmia.com/algorithms/nlp/LDA
lda = client.algo('nlp/LDA/1.0.0')

# Returns a list of dictionaries of trends
result = lda.pipe(lda_input).result

# LDA Mapping algorithm: https://algorithmia.com/algorithms/nlp/LDAMapper
lda_mapper = client.algo(
    'nlp/LDAMapper/0.1.1')

# LDA Mapper input using the LDA algorithm's result as 'topics' value
lda_mapper_input = {
    "topics": result,
    "docsList": docslist
}

# Prints out the result from calling the LDA Mapper algo
print(lda_mapper.pipe(lda_mapper_input).result)
