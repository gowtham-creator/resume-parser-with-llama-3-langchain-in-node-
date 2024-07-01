import requests

url = 'http://localhost:11434/api/chat'
data = {
    "model": "llama3",
    "messages": [
        {
            "role": "user",
            "content": "why is the sky blue?"
        }
    ]
}

response = requests.post(url, json=data)
print(response.json())