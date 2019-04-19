import json

def get_config():
    with open('config.json') as f:
        data = json.load(f)
        return data
