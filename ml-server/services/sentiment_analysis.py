from textblob import TextBlob
from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

# Initialize transformer model (using a lightweight model)
try:
    sentiment_pipeline = pipeline("sentiment-analysis", 
                                 model="distilbert-base-uncased-finetuned-sst-2-english")
except Exception as e:
    logger.warning(f"Could not load transformer model: {e}. Falling back to TextBlob")
    sentiment_pipeline = None

def analyze_sentiment(text):
    """Analyze sentiment of text using multiple methods"""
    
    # TextBlob analysis (fast, rule-based)
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    # Determine sentiment category
    if polarity > 0.1:
        sentiment_category = "positive"
    elif polarity < -0.1:
        sentiment_category = "negative"
    else:
        sentiment_category = "neutral"
    
    result = {
        "sentiment": sentiment_category,
        "score": round(polarity, 3),
        "confidence": round(abs(polarity), 3),
        "subjectivity": round(subjectivity, 3)
    }
    
    # Try transformer model if available (more accurate)
    if sentiment_pipeline and len(text) < 512:
        try:
            transformer_result = sentiment_pipeline(text[:512])[0]
            result["transformer_sentiment"] = transformer_result['label'].lower()
            result["transformer_score"] = round(transformer_result['score'], 3)
        except Exception as e:
            logger.error(f"Transformer analysis failed: {e}")
    
    return result