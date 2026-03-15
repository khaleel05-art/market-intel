import requests

url = "http://localhost:8000/api/rag/upload"
file_path = "backend/test.pdf"
query = "What models does MarketIntel use?"

with open(file_path, "rb") as f:
    files = {"file": f}
    data = {"query": query}
    try:
        response = requests.post(url, files=files, data=data, timeout=300)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
