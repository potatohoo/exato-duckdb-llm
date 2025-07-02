import ollama
from flask import jsonify, request
import pandas as pd

def handle_chat(request, df_global):
    question = request.json.get('question')
    if not question:
        return jsonify({'error': 'No question provided'}), 400

    if df_global['df'] is None:
        return jsonify({'error': 'No data loaded. Please upload a file first.'}), 400

    try:
        sample = df_global['df'].head(100).to_csv(index=False)
        prompt = f"""
You are a data analyst. Here is a sample of the data:

{sample}

Answer the following question using only the data above:
{question}
        """

        response = ollama.chat(
            model='llama3',
            messages=[{"role": "user", "content": prompt}]
        )
        answer = response['message']['content']
        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
