import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_sentiment():
    print("Testing sentiment analysis...")
    data = {
        "text": "This legislation is excellent and well-drafted."
    }
    response = requests.post(f"{BASE_URL}/api/analyze/sentiment", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_keywords():
    print("Testing keyword extraction...")
    data = {
        "text": "The new environmental protection act aims to reduce carbon emissions and promote renewable energy sources.",
        "top_n": 5
    }
    response = requests.post(f"{BASE_URL}/api/analyze/keywords", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_summarization():
    print("Testing text summarization...")
    data = {
        "text": "The proposed legislation seeks to modernize infrastructure. It includes provisions for sustainable development, digital connectivity, and urban planning. The bill also addresses climate change mitigation and public transportation improvements.",
        "max_length": 100
    }
    response = requests.post(f"{BASE_URL}/api/analyze/summarize", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_batch_analysis():
    print("Testing batch analysis...")
    data = {
        "feedbacks": [
            {"id": 1, "text": "This is a great policy initiative."},
            {"id": 2, "text": "I strongly oppose this legislation."},
            {"id": 3, "text": "The amendment needs more clarity on implementation."}
        ]
    }
    response = requests.post(f"{BASE_URL}/api/analyze/batch", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

if __name__ == "__main__":
    print("=" * 60)
    print("ML SERVER API TESTS")
    print("=" * 60 + "\n")
    
    test_health()
    test_sentiment()
    test_keywords()
    test_summarization()
    test_batch_analysis()
    
    print("=" * 60)
    print("ALL TESTS COMPLETED")
    print("=" * 60)