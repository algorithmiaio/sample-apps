import Algorithmia
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, send_file
from functools import wraps
import jwt
from os import environ, path
from pymongo import MongoClient
from shutil import copyfile
from sys import stderr
from tempfile import NamedTemporaryFile
from uuid import uuid4
from werkzeug.security import generate_password_hash, check_password_hash

# init flask app
app = Flask(__name__, static_url_path='')
app.secret_key = str(uuid4())
app.send_file_max_age_default = 0

# connect to db
db_client = MongoClient()
db = db_client.fullstack_demo
users = db.users

# create an Algorithmia client and temp dir in Hosted Data
try:
    algorithmia_api_key = environ['ALGORITHMIA_API_KEY']
except KeyError:
    raise SystemExit('Please set the evironment variable ALGORITHMIA_API_KEY, obtained from https://algorithmia.com/user#credentials')
client = Algorithmia.client(algorithmia_api_key)
algo_temp_dir = 'data://.my/temp/'
if not client.dir(algo_temp_dir).exists():
    client.dir(algo_temp_dir).create()

# datastructures
class User():

    def __init__(self, email, password, avatar='/default_avatar.png', bio=''):
        self.id = email
        self.passhash = generate_password_hash(password) if password else None
        self.avatar = avatar
        self.bio = bio

    def to_dict(self):
        return dict(id=self.id, avatar=self.avatar, bio=self.bio)

    @staticmethod
    def from_dict(user_dict):
        user = User(user_dict['id'], None, user_dict['avatar'], user_dict['bio'])
        user.passhash = user_dict['passhash']
        return user


# Algorithmia helper functions
def upload_file_algorithmia(local_filename, unique_id):
    remote_file = algo_temp_dir + unique_id
    client.file(remote_file).putFile(local_filename)
    return remote_file


def is_nude(remote_file):
    try:
        algo = client.algo('sfw/NudityDetectioni2v/0.2.13')
        return algo.pipe(remote_file).result['nude']
    except Exception as x:
        print('ERROR: unable to check %s for nudity: %s' % (remote_file, x), file=stderr)
        return False


def auto_crop(remote_file, height, width):
    input = {
        'height': height,
        'width': width,
        'image': remote_file
    }
    try:
        algo = client.algo('media/ContentAwareResize/0.1.3')
        return algo.pipe(input).result['output']
    except Exception as x:
        print('ERROR: unable to auto-crop %s: %s' % (remote_file, x), file=stderr)
        return remote_file


# auth helper functions
def generate_jwt(user):
    return jwt.encode({
        'id': user.id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(minutes=30)},
        app.config['SECRET_KEY'])


def token_required(f):
    @wraps(f)
    def _verify(*args, **kwargs):
        auth_headers = request.headers.get('Authorization', '').split()
        try:
            if len(auth_headers) != 2:
                raise jwt.InvalidTokenError()
            token = auth_headers[1]
            data = jwt.decode(token, app.config['SECRET_KEY'])
            user = user_loader(data['id'])
            if not user:
                return jsonify({'message':'Invalid credentials','authenticated':False}), 401
            return f(user, *args, **kwargs)
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return jsonify({'message':'Invalid or expired token','authenticated':False}), 401
    return _verify


def user_loader(email, password=None):
    user_dict = users.find_one({'id': email})
    if not user_dict:
        return None
    if password and not check_password_hash(user_dict['passhash'], password):
        return None
    return User.from_dict(user_dict)


# routes for webapp
@app.route('/', methods=['GET'])
def home():
    return send_file('static/index.htm')


@app.route('/register', methods=('POST',))
def register():
    data = request.get_json()
    if user_loader(data['email']):
        return jsonify({'message':'A user with that email already exists','authenticated':False}), 409
    user = User(data['email'],data['password'])
    users.insert_one(user.__dict__)
    token = generate_jwt(user)
    return jsonify({'token': token.decode('UTF-8'), 'user': user.to_dict()}), 201


@app.route('/login', methods=('POST',))
def login():
    data = request.get_json()
    user = user_loader(data['email'],data['password'])
    if not user:
        return jsonify({'message':'Invalid credentials','authenticated':False}), 401
    token = generate_jwt(user)
    return jsonify({'token': token.decode('UTF-8'), 'user': user.to_dict()})


@app.route('/account', methods=['GET'])
@token_required
def get_account(user):
    token = generate_jwt(user)
    return jsonify({'token': token.decode('UTF-8'), 'user': user.to_dict()})


@app.route('/account', methods=['POST'])
@token_required
def post_account(user):
    data = request.get_json()
    if 'bio' in data:
        user.bio = data['bio']
    if 'avatar' in request.files:
        avatar = request.files['avatar']
        file_ext = path.splitext(avatar.filename)[1]
        with NamedTemporaryFile(suffix=file_ext) as f:
            avatar.save(f)
            remote_file = upload_file_algorithmia(f.name, user.id+file_ext)
        if is_nude(remote_file):
            return jsonify({'message':'It appears that image contains nudity'}), 422
        cropped_remote_file = auto_crop(remote_file, 280, 280)
        cropped_file = client.file(cropped_remote_file).getFile()
        user.avatar = ('/avatars/%s%s' % (user.id, file_ext)).lower()
        copyfile(cropped_file.name, 'static/'+user.avatar)
    users.replace_one({'id': user.id}, user.__dict__)
    return jsonify({'user': user.to_dict()}), 201


# init db
try:
    if not db.users.list_indexes().alive:
        db.users.create_index('id', unique=True)
except:
    raise SystemExit('Unable to connect to database: please run "mongod --fork --dbpath ./mongodb --logpath ./mongodb/mongodb.log"')


# to start server: "python3 ./app.py"
if __name__ == '__main__':
    app.run()