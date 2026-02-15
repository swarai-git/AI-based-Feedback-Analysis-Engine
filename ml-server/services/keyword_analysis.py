from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
from nltk.corpus import stopwords
import spacy

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_keywords(text, top_n=10):
    """Extract keywords using multiple methods"""
    
    # Method 1: TF-IDF
    tfidf_keywords = extract_tfidf_keywords(text, top_n)
    
    # Method 2: Named Entity Recognition
    ner_keywords = extract_entities(text)
    
    # Method 3: Noun phrases
    noun_phrases = extract_noun_phrases(text)
    
    # Combine and deduplicate
    all_keywords = list(set(tfidf_keywords + ner_keywords + noun_phrases))
    
    return all_keywords[:top_n]

def extract_tfidf_keywords(text, top_n=10):
    """Extract keywords using TF-IDF"""
    try:
        vectorizer = TfidfVectorizer(
            max_features=top_n,
            stop_words='english',
            ngram_range=(1, 2)
        )
        
        tfidf_matrix = vectorizer.fit_transform([text])
        feature_names = vectorizer.get_feature_names_out()
        
        return list(feature_names)
    except:
        return []

def extract_entities(text):
    """Extract named entities"""
    doc = nlp(text)
    entities = [ent.text.lower() for ent in doc.ents 
                if ent.label_ in ['ORG', 'GPE', 'LAW', 'PERSON', 'EVENT']]
    return list(set(entities))

def extract_noun_phrases(text):
    """Extract noun phrases"""
    doc = nlp(text)
    noun_phrases = [chunk.text.lower() for chunk in doc.noun_chunks 
                   if len(chunk.text.split()) <= 3]
    return list(set(noun_phrases))[:5]