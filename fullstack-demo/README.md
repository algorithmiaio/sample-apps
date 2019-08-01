# Algorithmia Fullstack Demo

## Learn to use Algorithmia in a Fullstack Web Application

Complete, runnable end-to-end web application using:
 - VueJS (frontend)
 - Python/Flask (backend/webserver)
 - MongoDB (NoSQL database)
 - Algorithmia (machine learning algorithm hosting)
 - third-party APIs TBA

## This is a work-in-progress

More info coming soon!

## Setup

1. Install [MongoDB](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials) 3 or 4 (on OSX with [homebrew](https://brew.sh/#install): `brew install mongodb`, and you may need to edit [start.sh](start.sh) to use `/usr/local/opt/mongodb@[VERSION]/bin/mongod`)
2. Install [Python](https://www.python.org/downloads/) (on OSX: `brew install python3`); this demo will run under python2.7 or python3
3. Run [install.sh](install.sh), *or* `pip install -r requirements.txt` to install all the packages in [requirements.txt](requirements.txt)
4. Add your [Algorithmia API Key](https://algorithmia.com/user#credentials) to the env: `export ALGORITHMIA_API_KEY='YOUR_API_KEY'`

## Run

1. Run [start.sh](start.sh), *or* manually start mongo (e.g. `mongod --dbpath ./mongodb --logpath ./mongodb/mongodb.log`) and Flask (e.g. `python app.py`)
2. Browse to [http://127.0.0.1:5000](http://127.0.0.1:5000/)

## Further learning

1. [Algorithmia Learning Center](https://learn.algorithmia.com/)
2. [Algorithmia Developer Center](http://developers.algorithmia.com)
3. [API Docs](http://docs.algorithmia.com/)
