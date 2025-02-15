from flask import Flask, request

from flask_cors import CORS, cross_origin
app = Flask(__name__)


cors = CORS(app, supports_credentials=True);


@app.route("/turn-on", methods=['POST'])
def hello_world():
    return {
        "message": "s: Success!"
    }

@app.route("/demo", methods=['POST'])
def demo():
    req_data = request.get_json()

    print(req_data['message'])
    print(req_data['data'])

    return {
        "message": "The last user in the database is " + str(req_data["data"][-1])
    }

