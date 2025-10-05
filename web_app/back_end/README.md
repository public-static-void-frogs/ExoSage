# How to run:

Backend: port = 8000, host = 0.0.0.0

uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 

http://localhost:8000/docs

docker build -t backend-nasa .

docker run -p 8000:8000 backend-nasa