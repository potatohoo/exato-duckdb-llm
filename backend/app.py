from flask import Flask, request, jsonify, send_file
from upload_logic import handle_upload, df_global, con
from sql_logic import execute_sql
from llm_logic import handle_chat
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

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