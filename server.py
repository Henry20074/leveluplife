from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the absolute path to the project directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Create Flask app with static folder configuration
app = Flask(__name__, 
    static_folder=BASE_DIR,
    static_url_path='',
    template_folder=BASE_DIR
)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/')
def serve_index():
    print(f"Attempting to serve index.html from: {BASE_DIR}")
    try:
        with open(os.path.join(BASE_DIR, 'index.html'), 'r') as f:
            return f.read()
    except Exception as e:
        print(f"Error serving index.html: {str(e)}")
        return "Error loading index.html", 500

@app.route('/js/<path:path>')
def serve_js(path):
    print(f"Attempting to serve JS file: {path}")
    return send_from_directory(os.path.join(BASE_DIR, 'js'), path)

@app.route('/sounds/<path:path>')
def serve_sounds(path):
    print(f"Attempting to serve sound file: {path}")
    return send_from_directory(os.path.join(BASE_DIR, 'sounds'), path)

@app.route('/styles.css')
def serve_css():
    print("Attempting to serve styles.css")
    return send_from_directory(BASE_DIR, 'styles.css')

@app.route('/script.js')
def serve_script():
    print("Attempting to serve script.js")
    return send_from_directory(BASE_DIR, 'script.js')

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
    print(f"Server starting in directory: {BASE_DIR}")
    print(f"Files in directory: {os.listdir(BASE_DIR)}")
    app.run(debug=True, port=5000) 