import flask
import flask_login
from hashlib import sha224

app = flask.Flask(__name__)
app.secret_key = 'CHANGE_ME!'
login_manager = flask_login.LoginManager()
login_manager.init_app(app)
users = {'foo@bar.tld': {'password': '95c7fbca92ac5083afda62a564a3d014fc3b72c9140e3cb99ea6bf12'}} #secret


@app.route('/')
def home():
    message='Hello World!!'
    return flask.render_template('index.htm',message=message)


class User(flask_login.UserMixin):
    def __init__(self, id):
        self.id = id


@login_manager.user_loader
def user_loader(email):
    if email not in users:
        return
    user = User(email)
    return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if email not in users:
        return
    user = User(email)
    user.is_authenticated = request.form['password'] == users[email]['password']
    return user


@login_manager.unauthorized_handler
def unauthorized_handler():
    return 'Unauthorized'


@app.route('/login', methods=['GET', 'POST'])
def login():
    if flask.request.method == 'GET':
        return flask.render_template('login.htm')
    email = flask.request.form['email']
    if email in users and sha224(flask.request.form['password'].encode('utf-8')).hexdigest() == users[email]['password']:
        user = User(email)
        flask_login.login_user(user)
        return flask.redirect('/protected')
    return 'Bad login'


@app.route('/logout')
def logout():
    flask_login.logout_user()
    return 'Logged out'


@app.route('/protected')
@flask_login.login_required
def protected():
    if not flask_login.current_user:
        return flask.redirect('/')
    return 'Logged in as: ' + flask_login.current_user.id


if __name__ == '__main__':
    app.run()