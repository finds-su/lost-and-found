import os
import requests

ELSEVIER_KEY = os.getenv("ELSEVIER_KEY")
if (ELSEVIER_KEY is None):
    raise Exception("ELSEVIER_KEY does not exist in .env")

class Elsevier:
    @staticmethod
    def search(query: str, show: int = 25, offset: int = 0, order_by: str = 'relevance', open_access: bool = True):
        url = "https://api.elsevier.com/content/search/sciencedirect"

        headers = {
            "Content-Type": "application/json",
            "x-els-apikey": ELSEVIER_KEY
        }

        data = {
          "qs": query,
          "filters": {
              "openAccess": open_access
          },
          "display": {
              "offset": offset,
              "show": show,
              "sortBy": order_by
          }
        }

        response = requests.put(url, json=data, headers=headers)

        if response.status_code == 200:
            response_data = response.json()

            return response_data
        else:
            print("Request failed with status code:", response.status_code)