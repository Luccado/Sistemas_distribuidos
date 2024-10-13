from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas

@app.route('/api/message', methods=['GET'])
def get_message():
    return jsonify({'message': 'Hello from Backend!'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
