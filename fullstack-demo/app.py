import flask
import flask_login
from social_flask.routes import social_auth
from social_core.exceptions import SocialAuthBaseException

app = flask.Flask(__name__)
app.secret_key = 'CHANGE_ME!'
# SOCIAL_AUTH_STORAGE = 'social_flask_mongoengine.models.FlaskStorage'
app.register_blueprint(social_auth)
# from social_flask_mongoengine.models import init_social
# init_social(app, session)
SOCIAL_AUTH_USER_MODEL = 'User'

login_manager = flask_login.LoginManager()
login_manager.init_app(app)
users = {'foo@bar.tld': {'password': 'secret'}}

# @app.before_request
# def global_user():
#     g.user = get_current_logged_in_user

@app.route('/')
def home():
    message='Hello World!!'
    return flask.render_template('index.htm',message=message)


class User(flask_login.UserMixin):
    pass


@login_manager.user_loader
def user_loader(email):
    if email not in users:
        return
    user = User()
    user.id = email
    return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if email not in users:
        return
    user = User()
    user.id = email
    user.is_authenticated = request.form['password'] == users[email]['password']
    return user


@app.route('/login', methods=['GET', 'POST'])
def login():
    if flask.request.method == 'GET':
        return '''
               <form action='login' method='POST'>
                <input type='text' name='email' id='email' placeholder='email'/>
                <input type='password' name='password' id='password' placeholder='password'/>
                <input type='submit' name='submit'/>
               </form>
               '''
    email = flask.request.form['email']
    if email in users and flask.request.form['password'] == users[email]['password']:
        user = User()
        user.id = email
        flask_login.login_user(user)
        return flask.redirect(flask.url_for('protected'))

    return 'Bad login'


@app.route('/protected')
@flask_login.login_required
def protected():
    return 'Logged in as: ' + flask_login.current_user.id


@login_manager.unauthorized_handler
def unauthorized_handler():
    return 'Unauthorized'


@app.errorhandler(500)
def error_handler(error):
    if isinstance(error, SocialAuthBaseException):
        return redirect('/socialerror')

if __name__ == '__main__':
   app.run()