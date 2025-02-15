from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)


cors = CORS(app, supports_credentials=True);


@app.route("/turn-on", methods=['POST'])
def hello_world():
    return {
        "message": "s: Success!"
    }

