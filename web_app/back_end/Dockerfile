# Use AWS Lambda Python base image (Python 3.12)
FROM public.ecr.aws/lambda/python:3.12

# Set workdir inside container
WORKDIR /var/task

# Copy requirements
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Copy application code
COPY app ./app
COPY lambda_handler.py .

CMD ["lambda_handler.lambda_handler"]
