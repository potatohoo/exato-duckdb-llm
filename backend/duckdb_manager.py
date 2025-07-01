import pandas as pd
import duckdb
import io

def load_file_to_duckdb(file, table_name, conn):
    try:
        filename = file.filename.lower()
        if filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif filename.endswith('.xlsx'):
            df = pd.read_excel(file)
        else:
            return None  # unsupported type
        conn.register(table_name, df)
        return df
    except Exception as e:
        print("Error loading file:", e)
        return None
