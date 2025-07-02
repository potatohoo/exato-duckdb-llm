import os
import pandas as pd
import duckdb
from werkzeug.utils import secure_filename
from flask import jsonify
import pdfplumber

con = duckdb.connect()
df_global = {"df": None}

def handle_upload(request, upload_folder, con, df_global):
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    pdf_paragraphs = ""
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(filepath)
        elif filename.endswith('.xlsx'):
            df = pd.read_excel(filepath)
        elif filename.endswith('.json'):
            df = pd.read_json(filepath)
        elif filename.endswith('.parquet'):
            df = pd.read_parquet(filepath)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        if df.empty:
            return jsonify({'error': 'Empty data file'}), 400

        con.register('temp_df', df)
        con.execute("CREATE OR REPLACE TABLE temp_df AS SELECT * FROM temp_df")
        df_global['df'] = df
        return jsonify({'message': f'{filename} uploaded and loaded into DuckDB'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500