import flask
import flask_login
from hashlib import sha224
from pymongo import MongoClient


# datastructures
class User(flask_login.UserMixin):
    def __init__(self, email, password, passhash=None):
        self.id = email
        self.passhash = passhash if passhash else User.hashpass(password)
    @staticmethod
    def hashpass(password):
        return sha224(password.encode('utf-8')).hexdigest()


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

# init db
if not user_loader('foo@bar.tld', 'secret'):
    db.users.create_index('id', unique=True)
    dummy_user = User('foo@bar.tld', 'secret')
    users.insert_one(dummy_user.__dict__)


# login helper functions
@login_manager.user_loader
def user_loader(email, password=None):
    if password:
        user_dict = users.find_one({'id': email, 'passhash': User.hashpass(password)})
    else:
        user_dict = users.find_one({'id': email})
    return User(user_dict['id'], None, user_dict['passhash']) if user_dict else None


@login_manager.request_loader
def request_loader(request):
    user = user_loader(request.form.get('email'), request.form.get('password'))
    if user:
        user.is_authenticated = True
    return user


@login_manager.unauthorized_handler
def unauthorized_handler():
    return flask.redirect('/login')


# routes for webapp
@app.route('/')
def home():
    message = 'Hello World!!'
    return flask.render_template('index.htm', message=message)


@app.route('/protected')
@flask_login.login_required
def protected():
    if not flask_login.current_user:
        return flask.redirect('/')
    return 'Logged in as: ' + flask_login.current_user.id


# routes for flask_login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if flask.request.method == 'GET':
        return flask.render_template('login.htm')
    user = user_loader(flask.request.form['email'], flask.request.form['password'])
    if user:
        flask_login.login_user(user)
        return flask.redirect('/protected')
    return 'Bad login'


@app.route('/logout')
def logout():
    flask_login.logout_user()
    return 'Logged out'


# to start server: "python3 ./app.py"
if __name__ == '__main__':
    app.run()