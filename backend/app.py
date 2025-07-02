from flask import Flask, request, jsonify, send_file
from upload_logic import handle_upload, df_global, con
from sql_logic import execute_sql
from llm_logic import handle_chat
import os
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Welcome to the DuckDB LLM API"})

@app.route('/upload', methods=['POST'])
def upload_file():
    return handle_upload(request, app.config['UPLOAD_FOLDER'], con, df_global)

@app.route('/query', methods=['POST'])
def run_query():
    return execute_sql(request, con)

@app.route('/chat', methods=['POST'])
def chat():
    return handle_chat(request, df_global)

if __name__ == '__main__':
    app.run(debug=True, port=5000)