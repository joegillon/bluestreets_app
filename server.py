from flask import Flask, render_template, session
from flask_jsglue import JSGlue
from views.voters import vtr
from views.contacts import con
from views.groups import grp
from views.turfs import trf

server = Flask(__name__)
server.config["SEND_FILE_MAX_AGE_DEFAULT"] = 1  # disable caching

jsglue = JSGlue(server)

server.register_blueprint(vtr)
server.register_blueprint(con)
server.register_blueprint(grp)
server.register_blueprint(trf)


@server.route('/')
def homepage():
    return render_template(
        'home.html',
        title='Adlai says hello'
    )


@server.route('/goodbye')
def goodbye():
    return render_template(
        'home.html',
        title='Adlai says goodbye'
    )


@server.errorhandler(401)
def unauthorized_access():
    return render_template('401.html'), 401


@server.errorhandler(404)
def not_found():
    return render_template('404.html'), 404


def run_server():
    import os
    # import configparser

    app_path = os.path.dirname(__file__)

    # config = configparser.ConfigParser()
    # config.read(app_path + '/bluestreets.cfg')
    # server.secret_key = config['USER_MGT']['key']
    server.config['DATA_PATH'] = os.path.join(app_path, 'data\\')
    server.config['DB_PATH'] = os.path.join(app_path, 'data\\bst.db')
    server.config['API_URL'] = 'http://localhost:5000'

    server.run(host="127.0.0.1", port=23948, threaded=True)


if __name__ == "__main__":
    run_server()
