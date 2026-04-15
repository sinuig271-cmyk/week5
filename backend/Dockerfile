FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p data
CMD alembic upgrade head && python content/seed.py && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}