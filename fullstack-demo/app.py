import Algorithmia
import flask
from flask import request
import flask_login
from hashlib import sha224
from pymongo import MongoClient
from sys import stderr
from os import environ, path
from shutil import copyfile
from tempfile import NamedTemporaryFile

# init flask app
app = flask.Flask(__name__, static_url_path = '')
app.secret_key = 'CHANGE_ME!'
app.send_file_max_age_default = 0

# set up flask_login
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

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
class User(flask_login.UserMixin):
    def __init__(self, email, password, avatar='/default_avatar.png', bio=''):
        self.id = email
        self.passhash = User.hashpass(password) if password else None
        self.avatar = avatar
        self.bio = bio
    @staticmethod
    def hashpass(password):
        return sha224(password.encode('utf-8')).hexdigest()
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


# login helper functions
@login_manager.user_loader
def user_loader(email, password=None):
    if password:
        user_dict = users.find_one({'id': email, 'passhash': User.hashpass(password)})
    else:
        user_dict = users.find_one({'id': email})
    return User.from_dict(user_dict) if user_dict else None


@login_manager.request_loader
def request_loader(request):
    return user_loader(request.form.get('email'), request.form.get('password'))


@login_manager.unauthorized_handler
def unauthorized_handler():
    return flask.redirect('/login')


# routes for webapp
@app.route('/')
def home():
    return flask.send_file('static/index.htm')


@app.route('/account', methods=['GET', 'POST'])
@flask_login.login_required
def account():
    user = flask_login.current_user
    if not user:
        return flask.redirect('/')
    if request.method == 'POST':
        if 'bio' in request.form:
            user.bio = request.form['bio']
        if 'avatar' in request.files:
            avatar = request.files['avatar']
            file_ext = path.splitext(avatar.filename)[1]
            with NamedTemporaryFile(suffix=file_ext) as f:
                avatar.save(f)
                remote_file = upload_file_algorithmia(f.name, user.id+file_ext)
            if is_nude(remote_file):
                return flask.render_template('account.htm', message='It appears that image contains nudity; please try again', user=user)
            cropped_remote_file = auto_crop(remote_file, 280, 280)
            cropped_file = client.file(cropped_remote_file).getFile()
            user.avatar = ('/avatars/%s%s' % (user.id, file_ext)).lower()
            copyfile(cropped_file.name, 'static/'+user.avatar)
    users.replace_one({'id': user.id}, user.__dict__)
    return flask.render_template('account.htm', user=user)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return flask.render_template('login.htm')
    user = user_loader(request.form['email'], request.form['password'])
    if user:
        flask_login.login_user(user)
        return flask.redirect('/account')
    return flask.render_template('login.htm', message='No user found with that password')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return flask.render_template('login.htm')
    flask_login.logout_user()
    email = request.form['email']
    password = request.form['password']
    if user_loader(email):
        return flask.render_template('login.htm', message='A user with that email already exists')
    user = User(email, password)
    users.insert_one(user.__dict__)
    flask_login.login_user(user)
    return flask.redirect('/account')


@app.route('/logout')
def logout():
    flask_login.logout_user()
    return flask.render_template('login.htm', message='You have been logged out')


# init db
try:
    if not db.users.list_indexes().alive:
        db.users.create_index('id', unique=True)
except:
    raise SystemExit('Unable to connect to database: please run "mongod --fork --dbpath ./mongodb --logpath ./mongodb/mongodb.log"')


# to start server: "python3 ./app.py"
if __name__ == '__main__':
    app.run()