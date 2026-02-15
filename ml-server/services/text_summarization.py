from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

# Initialize summarization pipeline
try:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
except Exception as e:
    logger.warning(f"Could not load summarization model: {e}")
    summarizer = None

def generate_summary(text, max_length=150):
    """Generate text summary"""
    
    # If text is too short, return as is
    if len(text.split()) < 30:
        return text
    
    # Try transformer-based summarization
    if summarizer:
        try:
            # BART works best with 1024 tokens
            input_text = ' '.join(text.split()[:1000])
            
            summary = summarizer(input_text, 
                               max_length=max_length, 
                               min_length=30, 
                               do_sample=False)
            
            return summary[0]['summary_text']
        except Exception as e:
            logger.error(f"Summarization failed: {e}")
    
    # Fallback: extractive summarization (simple sentence selection)
    return extractive_summary(text, max_length)

def extractive_summary(text, max_length=150):
    """Simple extractive summarization"""
    sentences = text.split('.')
    
    # Take first few sentences up to max_length
    summary = []
    current_length = 0
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        
        sentence_length = len(sentence.split())
        if current_length + sentence_length <= max_length:
            summary.append(sentence)
            current_length += sentence_length
        else:
            break
    
    return '. '.join(summary) + '.'