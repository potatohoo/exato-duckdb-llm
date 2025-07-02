import ollama
from flask import jsonify, send_file
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
            model='llama3.1',
            messages=[{"role": "user", "content": prompt}]
        )
        answer = response['message']['content']
        output_path = 'chat_result.txt'
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(answer)

        return send_file(output_path, as_attachment=True, download_name='chat_result.txt')

    except Exception as e:
        return jsonify({'error': str(e)}), 500