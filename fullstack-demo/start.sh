#!/usr/bin/env bash
mongod --fork --dbpath ./mongodb --logpath ./mongodb/mongodb.log
python app.py