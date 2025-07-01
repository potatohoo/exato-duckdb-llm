from flask import Flask, request, jsonify
import duckdb
import pandas as pd
import os
import uuid
from duckdb_manager import load_file_to_duckdb
from llm import chat_with_llm

app = Flask(__name__)
duckdb_conn = duckdb.connect(database=':memory:')

TABLE_METADATA = {}  # file_id -> table info


@app.route("/api/files/upload", methods=["POST"])
def upload_file():
    uploaded_files = request.files.getlist("files")
    options = request.form.get("options")
    options = eval(options) if options else {}
    prefix = options.get("table_prefix", "user_data_")

    response_files = []

    for file in uploaded_files:
        file_id = str(uuid.uuid4())
        filename = file.filename
        table_name = f"{prefix}{filename.replace('.', '_').lower()}"

        df = load_file_to_duckdb(file, table_name, duckdb_conn)
        if df is None:
            continue

        TABLE_METADATA[file_id] = {
            "file_id": file_id,
            "filename": filename,
            "table_name": table_name,
            "columns": df.columns.tolist(),
            "row_count": len(df)
        }

        response_files.append(TABLE_METADATA[file_id])

    return jsonify({
        "success": True,
        "files": response_files
    })


@app.route("/api/query/execute", methods=["POST"])
def execute_query():
    data = request.get_json()
    query = data.get("query")

    try:
        result_df = duckdb_conn.execute(query).fetchdf()
        return jsonify({
            "success": True,
            "columns": result_df.columns.tolist(),
            "data": result_df.to_dict(orient="records"),
            "row_count": len(result_df),
            "query": query
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/llm/chat", methods=["POST"])
def llm_chat():
    data = request.get_json()
    message = data.get("message")
    context = data.get("context", {})
    response = chat_with_llm(message, context)
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
