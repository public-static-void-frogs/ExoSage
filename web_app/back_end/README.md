# Run the project in the Python environment
Navigate to back-end directory
```shell
cd web_app/back_end
```
Create virtual environment
```shell
python -m venv .venv
```

Activate environment for Windows
```shell
.venv/Scripts/activate
```

Activate environment for Linux
```shell
source .venv/bin/activate
```

Install necessary libraries
```shell
pip install -r requirements.txt
```

```shell
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 
```
The Swaggger UI can be accessed via the following url http://<host>:8000/docs

# Run the project with Docker
Navigate to back-end directory
```shell
cd web_app/back_end
```
Build image
```shell
docker build -t backend-nasa .
```
Run the container
```shell
docker run -p 8000:8000 backend-nasa
```

The Swaggger UI can be accessed via the following url http://<host>:8000/docs
