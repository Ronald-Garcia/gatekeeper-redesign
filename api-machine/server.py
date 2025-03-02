from flask import Flask, request

from flask_cors import CORS, cross_origin
app = Flask(__name__)


cors = CORS(app, supports_credentials=True);

@app.route("/", methods=['GET'])
def hello_world():
    return {
        "message": "Welcome to Flask!"
    }

@app.route("/turn-on", methods=['POST'])
def turn_on():
    return {
        "message": "s: Success!"
    }

@app.route("/whoami", methods=['POST'])
def whoami_post():
    req_data = request.get_json()
    machine_id = req_data['id']
    success = True
    message = "Successfully saved machine information"

    try:
        with open('.env', "w") as f:
            f.write(str(machine_id))
    except IOError as e:
        message = f"Could not write to file ({e})"
        success = False

    return {
        "success": success,
        "message": message,
    }

@app.route("/whoami", methods=['GET'])
def whoami_get():

    message = "Successfully read machine_id from file."
    success = True
    try:
        with open('.env', 'r') as f:
            machine_id = int(f.readline())
    except IOError as e:
        message = f"Could not find file ({e})"
        success = False
        machine_id = None
    except ValueError as e:
        message = f"Invalid machine id found on file! Please choose another machine"
        success = False
        machine_id = None

    print({
        "success": success,
        "message": message,
        "data": machine_id
    })

    return {
        "success": success,
        "message": message,
        "data": machine_id
    }



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
