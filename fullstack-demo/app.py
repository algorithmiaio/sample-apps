import Algorithmia
import flask
import flask_login
from hashlib import sha224
import os
from shutil import copyfile
import tempfile

from pymongo import MongoClient

# init flask app
app = flask.Flask(__name__)
app.secret_key = 'CHANGE_ME!'

# set up flask_login
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

# connect to db
db_client = MongoClient()
db = db_client.fullstack_demo
users = db.users

# create an Algorithmia client and temp dir in Hosted Data
algorithmia_api_key = os.environ['ALGORITHMIA_API_KEY']
client = Algorithmia.client(algorithmia_api_key)
algo_temp_dir = 'data://.my/temp/'
if not client.dir(algo_temp_dir).exists():
    client.dir(algo_temp_dir).create()

# datastructures
class User(flask_login.UserMixin):
    def __init__(self, email, password, avatar='static/avatar.png', bio=''):
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


# check for nudity via Algorithmia
def is_nude(filename, file_id):
    remote_file = algo_temp_dir+file_id
    client.file(remote_file).putFile(filename)
    algo = client.algo('sfw/NudityDetectioni2v/0.2.13')
    return algo.pipe(remote_file).result['nude']


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
    return flask.render_template('index.htm')


@app.route('/account', methods=['GET', 'POST'])
@flask_login.login_required
def account():
    user = flask_login.current_user
    if not user:
        return flask.redirect('/')
    if flask.request.method == 'POST':
        if 'bio' in flask.request.form:
            user.bio = flask.request.form['bio']
        if 'avatar' in flask.request.files:
            avatar = flask.request.files['avatar']
            file_ext = os.path.splitext(avatar.filename)[1]
            f = tempfile.NamedTemporaryFile(suffix=file_ext)
            avatar.save(f)
            if is_nude(f.name, user.id+file_ext):
                f.close()
                return flask.render_template('account.htm', message='It appears that image contains nudity; please try again', user=user)
            user.avatar = ('static/%s%s' % (user.id, file_ext)).lower()
            copyfile(f.name, user.avatar)
            f.close()
    users.replace_one({'id': user.id}, user.__dict__)
    return flask.render_template('account.htm', user=user)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if flask.request.method == 'GET':
        return flask.render_template('login.htm')
    user = user_loader(flask.request.form['email'], flask.request.form['password'])
    if user:
        flask_login.login_user(user)
        return flask.redirect('/account')
    return flask.render_template('login.htm', message='No user found with that password')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if flask.request.method == 'GET':
        return flask.render_template('login.htm')
    flask_login.logout_user()
    email = flask.request.form['email']
    password = flask.request.form['password']
    if user_loader(email):
        return flask.render_template('login.htm', message='A user with that email already exists')
    user = User(email, password)
    users.insert_one(user.__dict__)
    flask_login.login_user(user)
    return flask.redirect('/account')


@app.route('/logout')
def logout():
    flask_login.logout_user()
    return 'Logged out'


# init db
if not db.users.list_indexes().alive:
    db.users.create_index('id', unique=True)


# to start server: "python3 ./app.py"
if __name__ == '__main__':
    app.run()