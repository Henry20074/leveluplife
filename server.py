from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    context = data.get('context', {})
    
    # Create a system prompt with context
    system_prompt = f"""You are an AI assistant for a self-improvement app called LevelUp Life. 
    The user is currently focusing on the {context.get('area', 'Physical')} area.
    Their current level is {context.get('level', 1)} and they have {context.get('xp', 0)} XP.
    
    Current active quests:
    {format_quests(context.get('quests', []))}
    
    Your role is to:
    1. Help users understand and complete their quests
    2. Provide motivation and encouragement
    3. Give personalized advice based on their focus area
    4. Answer questions about the app and self-improvement
    5. Be friendly, supportive, and engaging
    
    Keep responses concise and actionable. Focus on helping the user make progress in their journey."""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        return jsonify({
            'response': response.choices[0].message.content,
            'success': True
        })
    except Exception as e:
        return jsonify({
            'response': f"I'm sorry, I encountered an error: {str(e)}",
            'success': False
        })

def format_quests(quests):
    if not quests:
        return "No active quests"
    return "\n".join([
        f"- {q.get('title', 'Unnamed Quest')}: {q.get('description', 'No description')}"
        for q in quests if not q.get('completed', False)
    ])

if __name__ == '__main__':
    app.run(port=5000) 