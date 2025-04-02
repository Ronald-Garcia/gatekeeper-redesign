from flask import Flask, request
# import gpiozero
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)


# led = gpiozero.LED(20)


# led = gpiozero.LED(20)
cors = CORS(app, supports_credentials=True);
@app.route("/", methods=['GET'])
def hello_world():
    return {
        "message": "Welcome to Flask!"
    }
@app.route("/turn-on", methods=['POST'])
def turn_on():

    # if led.is_lit:
        # return {
            # "success": False,
            # "message": "Machine is currently already on!"
        # }

    # led.on()
    
    print("Pulse received! Turning on GPIO20")

    return {
        "success": True,
        "message": "s: Success!"
    }
@app.route("/turn-off", methods=['POST'])
def turn_off():
    # if not led.is_lit:
    #     return {
    #         "success": False,
    #         "message": "Machine is currently already off!"
    #     }
    # led.off()
    print("Pulse received! Turning off GPIO20")
    return {
        "success": True,
        "message": "Machine turned off successfully"
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
        success = True
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

@app.route("/clear", methods=['DELETE'])
def clear_data():
    if os.path.exists(".env"):
        os.remove(".env")
        return {
            "success": True,
            "message": "Successfully cleared machine data"
        }
    else: 
        return {
            "success": False,
            "message": "No machine data found!"
        }



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
