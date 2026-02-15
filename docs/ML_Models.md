# ML Models Documentation

## Sentiment Analysis
- **Model**: TextBlob + DistilBERT
- **Output**: positive/negative/neutral + confidence score

## Keyword Extraction
- **Methods**: TF-IDF + spaCy NER
- **Output**: Top N keywords with relevance scores

## Text Summarization
- **Model**: BART (facebook/bart-large-cnn)
- **Fallback**: Extractive summarization

## Duplicate Detection
- **Method**: Sentence embeddings + cosine similarity
- **Threshold**: 0.85 similarity score