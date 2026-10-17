import time
import random
import requests
import json
import os

# API URL for your Flask app
API_URL = "http://127.0.0.1:5000/predict"
# Shared file for Streamlit to read
LOG_FILE = "live_data.json"

# Initialize totals
totals = {
    "Apple": {"Positive": 0, "Neutral": 0, "Negative": 0}, 
    "Samsung": {"Positive": 0, "Neutral": 0, "Negative": 0}
}

mock_data_pool = [
    {"title": "The new iPhone battery life is amazing!", "content": "Best phone ever.", "brand": "Apple"},
    {"title": "Samsung Galaxy S24 display is stunning.", "content": "Love the colors.", "brand": "Samsung"},
    {"title": "Disappointed with Apple customer service.", "content": "They were not helpful.", "brand": "Apple"},
    {"title": "Samsung software updates are too slow.", "content": "Still waiting for the patch.", "brand": "Samsung"},
    {"title": "Thinking of switching to Apple for the ecosystem.", "content": "Everything just works.", "brand": "Apple"},
    {"title": "Samsung camera is way better than iPhone.", "content": "The zoom is incredible.", "brand": "Samsung"},
    {"title": "iPhone feels overpriced this year.", "content": "Not worth the upgrade.", "brand": "Apple"}
]

print("!!! STARTING LIVE DATA PIPELINE !!!")
print(f"Targeting Sentiment Engine: {API_URL}")

try:
    while True:
        # 1. Pick a random post
        post = random.choice(mock_data_pool)
        brand_key = post['brand']
        
        # 2. Prepare and send payload
        payload = {"text": f"{post['title']} {post['content']}"}
        
        try:
            response = requests.post(API_URL, json=payload)
            result = response.json()
            sentiment = result.get('sentiment_class', 'Neutral') # Default to Neutral if error

            # 3. Update the totals in memory
            # Ensuring we match the 'Positive', 'Negative', 'Neutral' keys exactly
            sentiment_key = sentiment.capitalize() 
            if sentiment_key in totals[brand_key]:
                totals[brand_key][sentiment_key] += 1
            
            # 4. Save to JSON file for Dashboard
            with open(LOG_FILE, "w") as f:
                json.dump(totals, f)

            print(f"\n[STREAMING]: {brand_key} - {post['title']}")
            print(f"[AI RESULT]: {sentiment_key}")
            
        except Exception as e:
            print(f"Connection Error: Is app.py running? ({e})")
        
        # New post every 3 seconds
        time.sleep(3)

except KeyboardInterrupt:
    print("\nStream terminated by user.")