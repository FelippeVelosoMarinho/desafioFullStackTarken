FROM python:3.9-buster

WORKDIR /app
COPY . /app

RUN apt-get update && apt-get install -y \
    ffmpeg \
    build-essential \
    autoconf \
    automake \
    libtool \
    pkg-config \
    wget \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/xiph/rnnoise.git /app/rnnoise

WORKDIR /app/rnnoise

RUN ./autogen.sh
RUN ./configure
RUN make

WORKDIR /app

RUN pip install --no-cache-dir fastapi uvicorn pydub python-multipart

ENV PYTHONUNBUFFERED=1

EXPOSE 8070