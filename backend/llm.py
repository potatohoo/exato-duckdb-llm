import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def chat_with_llm(message, context):
    try:
        # Basic system prompt
        prompt = f"User: {message}\nTables: {context.get('available_tables')}\nRecent Queries: {context.get('recent_queries')}"
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You're a helpful SQL assistant."},
                      {"role": "user", "content": prompt}]
        )
        content = response.choices[0].message.content
        return {
            "response": content,
            "suggested_queries": [],  # You could extract SQL suggestions using regex or post-processing
            "session_id": context.get("session_id", "session-default")
        }
    except Exception as e:
        return {"response": "LLM error", "error": str(e)}
