from typing import Union

from fastapi import FastAPI
from components import test1

app = FastAPI()


@app.get("/")
def read_root():
    test()
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


if __name__ == "__main__":
    test1()