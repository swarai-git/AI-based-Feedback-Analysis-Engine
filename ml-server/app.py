from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

from services.sentiment_analysis import analyze_sentiment
from services.text_summarization import generate_summary
from services.keyword_analysis import extract_keywords
from services.preprocessing import preprocess_text

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ML Server"})

@app.route('/api/analyze/sentiment', methods=['POST'])
def sentiment_analysis():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        cleaned_text = preprocess_text(text)
        result = analyze_sentiment(cleaned_text)
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Sentiment analysis error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze/keywords', methods=['POST'])
def keyword_extraction():
    try:
        data = request.json
        text = data.get('text', '')
        top_n = data.get('top_n', 10)
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        cleaned_text = preprocess_text(text)
        keywords = extract_keywords(cleaned_text, top_n)
        
        return jsonify({"keywords": keywords})
    except Exception as e:
        logger.error(f"Keyword extraction error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze/summarize', methods=['POST'])
def text_summarization():
    try:
        data = request.json
        text = data.get('text', '')
        max_length = data.get('max_length', 150)
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        summary = generate_summary(text, max_length)
        
        return jsonify({"summary": summary})
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze/batch', methods=['POST'])
def batch_analysis():
    try:
        data = request.json
        feedbacks = data.get('feedbacks', [])
        
        if not feedbacks:
            return jsonify({"error": "Feedbacks array is required"}), 400
        
        results = []
        for feedback in feedbacks:
            text = feedback.get('text', '')
            cleaned_text = preprocess_text(text)
            
            sentiment = analyze_sentiment(cleaned_text)
            keywords = extract_keywords(cleaned_text, 5)
            summary = generate_summary(text, 100)
            
            results.append({
                "id": feedback.get('id'),
                "sentiment": sentiment,
                "keywords": keywords,
                "summary": summary
            })
        
        return jsonify({"results": results})
    except Exception as e:
        logger.error(f"Batch analysis error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)