from flask import Flask, request, jsonify
import pickle
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import re
import nltk
import json
import os
import random # Added for mock data logic
from dotenv import load_dotenv

# Pre-downloaded assets for nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

load_dotenv()

app = Flask(__name__)

# Load local models (No API key needed)
model = tf.keras.models.load_model('best_sentiment_model.h5')
# Line 25
with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)  # <--- MUST be indented

# Line 27 (This should NOT be indented, keep it at the margin)
max_length = 100
def clean_text(text):
    if not text: return ""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    tokens = nltk.word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    return " ".join(tokens)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    text = data.get('text', '')
    cleaned_text = clean_text(text)

    # 1. Local TensorFlow Prediction
    sequences = tokenizer.texts_to_sequences([cleaned_text])
    padded_seq = pad_sequences(sequences, maxlen=max_length, padding='post', truncating='post')
    prediction = model.predict(padded_seq)
    predicted_class = int(prediction.argmax(axis=-1)[0])
    
    mapped_label = predicted_class - 1 # Maps 0,1,2 to -1,0,1
    actual_label_dict = {-1: 'Negative', 0: 'Neutral', 1: 'Positive'}
    mapped_label_class = actual_label_dict[mapped_label]

    # 2. Mock Topic Extraction (Bypassing Gemini API)
    # This prevents the app from crashing due to missing API keys
    brand = "Apple" if "apple" in text.lower() else "Samsung" if "samsung" in text.lower() else "General"
    
    # Generate a fake topic based on keywords to look "smart" during the demo
    if "battery" in text.lower():
        topic_name = "Battery Life & Power"
    elif "price" in text.lower() or "cost" in text.lower():
        topic_name = "Value & Price"
    elif "software" in text.lower() or "ios" in text.lower() or "android" in text.lower():
        topic_name = "Software & Ecosystem"
    else:
        topic_name = "Product Features"

    topics = [
        {
            "topic": topic_name,
            "sentiment": mapped_label_class.lower(),
            "mention_count": 1
        }
    ]

    # Return same structure so frontend doesn't break
    return jsonify({
        'sentiment': mapped_label,
        'sentiment_class': mapped_label_class,
        'raw_prediction': prediction.tolist(),
        'topics': topics
    })

if __name__ == '__main__':
    # host 0.0.0.0 is required for Docker
    app.run(host='0.0.0.0', port=5000, debug=True)