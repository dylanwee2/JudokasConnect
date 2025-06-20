FROM python:3.9

# Install FFmpeg system binary
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /code


COPY ./requirements.txt /code/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt


COPY ./app /code/app
COPY ./env /code/env


CMD ["fastapi", "run", "app/main.py", "--port", "8000" , "--reload"]