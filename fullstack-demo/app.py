from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def home():
    message='Hello World!!'
    return render_template('index.htm',message=message)
