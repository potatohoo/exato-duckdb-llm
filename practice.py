import duckdb as dd
import pandas as pd
import pdfplumber
import ollama  # <--- Using native Ollama API

# Load data from file
file = r'D:\projects\exato-duckdb-llm\student.csv'

pdf_paragraphs = ""
if file.endswith('.csv'):
    df = pd.read_csv(file)
elif file.endswith('.json'):
    df = pd.read_json(file)
elif file.endswith('.parquet'):
    df = pd.read_parquet(file)
elif file.endswith('.xlsx'):
    df = pd.read_excel(file)
elif file.endswith('.pdf'):
    with pdfplumber.open(file) as pdf:
        paragraphs = []
        tables = []
        for page in pdf.pages:
            page_tables = page.extract_tables()
            for table in page_tables:
                df_table = pd.DataFrame(table[1:], columns=table[0]) if table and len(table) > 1 else pd.DataFrame(table)
                if not df_table.empty:
                    tables.append(df_table)
            text = page.extract_text()
            if text:
                paragraphs.extend([p.strip() for p in text.split('\n\n') if p.strip()])
        if tables:
            df = pd.concat(tables, ignore_index=True)
        else:
            df = pd.DataFrame()
        pdf_paragraphs = "\n\n".join(paragraphs)
else:
    raise ValueError("Unsupported file format")

if df.empty:
    raise ValueError("The DataFrame is empty. Please check the file content.")
if pdf_paragraphs:
    print("PDF Text:\n", pdf_paragraphs)

# Register in DuckDB
con = dd.connect()
con.register("temp_df", df)
con.execute("CREATE OR REPLACE TABLE temp_df AS SELECT * FROM temp_df")

# Sample data to pass to the LLM
data_snapshot = con.execute("SELECT * FROM temp_df LIMIT 100").fetchdf()
text_chunk = data_snapshot.to_csv(index=False)

# Define your natural language question
user_question = "What are the average marks of females?"

# Compose prompt
prompt = f"""
You are a helpful data analyst. Here's a snapshot of a dataset:

{text_chunk}

Answer the following question using only the data above:
{user_question}
"""

# Query Gemma via Ollama API
response = ollama.chat(
    model='mistral',
    messages=[{"role": "user", "content": prompt}]
)

print("\nLLM Answer:\n", response['message']['content'])

con.close()