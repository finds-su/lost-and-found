import os
import requests
from typing import List

KEY = os.getenv("KEY")
if (KEY is None):
    raise Exception("KEY does not exist in .env")


class Message:
    def __init__(self, role: str, text: str):
        self.role = role
        self.text = text


class TextGeneration:
    @staticmethod
    def chat(messages: List[Message], instruction: str, temperature: float = 0.5, max_tokens: int = 2000):
        url = "https://llm.api.cloud.yandex.net/llm/v1alpha/chat"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Api-Key {KEY}"
        }

        data = {
            "model": "general",
            "generationOptions": {
                # "partialResults": True,
                "temperature": temperature,
                "maxTokens": max_tokens
            },
            "messages": list(map(lambda msg: vars(msg), messages)),
            "instructionText": instruction
        }

        response = requests.post(url, json=data, headers=headers)

        if response.status_code == 200:
            response_data = response.json()
            # Example:
            # {'result': {'message': {'role': 'Ассистент', 'text': 'Привет! Чем я могу вам помочь?'}, 'num_tokens': '21'}}
            return response_data
        else:
            print("Request failed with status code:", response.status_code)

    @staticmethod
    def instruct(request_text: str, instruction: str, temperature: float = 0.5, max_tokens: int = 2000):
        url = "https://llm.api.cloud.yandex.net/llm/v1alpha/instruct"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Api-Key {KEY}"
        }

        data = {
            "model": "general",
            "generationOptions": {
                # "partialResults": True,
                "temperature": temperature,
                "maxTokens": max_tokens
            },
            "requestText": request_text,
            "instructionText": instruction
        }

        response = requests.post(url, json=data, headers=headers)

        if response.status_code == 200:
            response_data = response.json()
            # Example:
            # {'result': {'alternatives': [{'text': 'Здравствуйте! Я всегда готов помочь вам с любыми вопросами или задачами. Чем я могу вам помочь сегодня?', 'score': -0.491208016872406, 'num_tokens': '20'}], 'num_prompt_tokens': '8'}}
            return response_data
        else:
            print("Request failed with status code:", response.status_code)


class Tokenizer:
    @staticmethod
    def tokenize(text: str):
        url = "https://llm.api.cloud.yandex.net/llm/v1alpha/tokenize"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Api-Key {KEY}"
        }

        data = {
            "model": "general",
            "text": text
        }

        response = requests.post(url, json=data, headers=headers)

        if response.status_code == 200:
            response_data = response.json()
            # Example:
            # {'tokens': [{'id': '0', 'text': '<s>', 'special': True}, {'id': '763', 'text': '▁как', 'special': False}, {'id': '1731', 'text': '▁дела', 'special': False}, {'id': '125917', 'text': '?', 'special': False}, {'id': '4', 'text': '[SEP]', 'special': True}]}
            return response_data
        else:
            print("Request failed with status code:", response.status_code)