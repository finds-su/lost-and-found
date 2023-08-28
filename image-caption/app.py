import os
import re
import uuid
from langchain.document_loaders import ImageCaptionLoader
from langchain.indexes import VectorstoreIndexCreator

from langchain.vectorstores import Chroma
from fastapi import FastAPI, File, UploadFile, Response

app = FastAPI(title="Image Captioning API")

os.environ["TOKENIZERS_PARALLELISM"] = "true"


@app.post("/image-caption")
def image_caption(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        return Response(status_code=415, content="Unsupported Media Type")

    random_filename = str(uuid.uuid4())

    try:
        with open(random_filename, "wb") as buffer:
            buffer.write(file.file.read())

        loader = ImageCaptionLoader(path_images=random_filename)
        list_docs = loader.load()

        index = VectorstoreIndexCreator(
            vectorstore_kwargs={"collection_name": random_filename}
        ).from_documents(list_docs)

        res = index.query(
            "Что изображено на фотографии? Только описание предмета, без вводных фраз по типу 'на фотографии изображено'. Ответ на русском языке для заголовка фотографии: "
        )

        res = res.strip()
        res = re.sub(r"\.$", "", res)

        return res
    finally:
        os.remove(random_filename)


blip_processor = "Salesforce/blip-image-captioning-base"
blip_model = "Salesforce/blip-image-captioning-base"


@app.on_event("startup")
async def startup_event():
    print("Starting up...")

    from transformers import BlipForConditionalGeneration, BlipProcessor

    # Download model and configuration from huggingface.co and cache.
    processor = BlipProcessor.from_pretrained(blip_processor)
    model = BlipForConditionalGeneration.from_pretrained(blip_model)

    print("Model loaded")
