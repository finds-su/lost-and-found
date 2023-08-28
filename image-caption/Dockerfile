FROM python:3.9 AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --user --no-cache-dir -r requirements.txt

# For CPU-only:
RUN pip install --user --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# For CUDA-enabled GPUs:
# RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

RUN python -c "from transformers import BlipForConditionalGeneration, BlipProcessor; BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-base'); BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-base')"



FROM python:3.9-slim

WORKDIR /app

COPY --from=builder /root/.local /root/.local
# For huggingface models
COPY --from=builder /root/.cache /root/.cache

COPY . .                

ENV PATH=/root/.local/bin:$PATH

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8989"]
