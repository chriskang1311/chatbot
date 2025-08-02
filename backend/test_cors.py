from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    return jsonify({"response": "CORS test successful"})

if __name__ == "__main__":
    app.run(debug=True)
