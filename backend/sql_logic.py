import tempfile
from flask import jsonify, send_file

def execute_sql(request, con):
    sql = request.json.get('sql')
    if not sql:
        return jsonify({'error': 'No SQL query provided'}), 400
    try:
        result_df = con.execute(sql).fetchdf()
        path = tempfile.mktemp(suffix=".csv")
        result_df.to_csv(path, index=False)
        return send_file(path, as_attachment=True, download_name='query_result.csv')
    except Exception as e:
        return jsonify({'error': str(e)}), 500