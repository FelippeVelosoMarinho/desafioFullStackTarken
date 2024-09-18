from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydub import AudioSegment, silence
import subprocess
import io
import os

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pasta para arquivos temporários
os.makedirs("/tmp", exist_ok=True)

# Salva arquivo de input
def save_file(file: UploadFile, filename: str):
    with open(filename, "wb") as temp_file:
        temp_file.write(file.file.read())

# Converte áudio .wav para .raw
def wav_to_raw(audio_wav: str, audio_raw: str):
    ffmpeg_command = [
        "ffmpeg",
        "-i", audio_wav,
        "-ac", "1",
        "-ar", "48000",
        "-sample_fmt", "s16",
        "-f", "s16le",
        "-y", audio_raw,
    ]
    subprocess.run(ffmpeg_command)

# Converte áudio .raw para .wav
def raw_to_wav(audio_raw: str, audio_wav: str):
    ffmpeg_command = [
        "ffmpeg",
        "-f", "s16le",
        "-ar", "48000",
        "-ac", "1",
        "-i", audio_raw,
        "-y", audio_wav,
    ]
    subprocess.run(ffmpeg_command)

def reduce_noise(input_raw: str, output_raw: str):
    # Executa o rnnoise para reduzir o ruído
    rnnoise_command = [
        "./rnnoise/examples/rnnoise_demo",
        input_raw,
        output_raw
    ]
    subprocess.run(rnnoise_command)
    
def remove_silence(input_silence: str, output_silence: str):
    # Converte o arquivo de áudio para o tipo AudioSegment
    audio = AudioSegment.from_file(input_silence, format="wav")

    # Divide o áudio em segmentos nos pontos de silêncio
    audio_chunks = silence.split_on_silence(
        audio,
        silence_thresh=-40,
        min_silence_len=1000,
        keep_silence=500
    )

    # Junta os segmentos não silenciosos
    joined_audio = AudioSegment.silent(duration=0)
    for section in audio_chunks:
        joined_audio += section

    # Salva o áudio
    joined_audio.export(output_silence, format="wav")

@app.post("/audio")
async def prepare(file: UploadFile):
    temp_path = "/tmp/temp.wav"
    input_noise = "/tmp/input_noise.raw"
    output_noise = "/tmp/output_noise.raw"
    input_silence = "/tmp/input_silence.wav"
    output_silence = "/tmp/output_silence.wav"

    try:
        save_file(file, temp_path)
        wav_to_raw(temp_path, input_noise)
        reduce_noise(input_noise, output_noise)

        # Verifica se o arquivo de saída não está vazio
        if os.path.getsize(output_noise) == 0:
            raise HTTPException(status_code=500, detail="Arquivo de saída do rnnoise está vazio")

        raw_to_wav(output_noise, input_silence)
        remove_silence(input_silence, output_silence)

        with open(output_silence, "rb") as output_file:
            return StreamingResponse(io.BytesIO(output_file.read()), media_type="audio/wav")
    
    except subprocess.CalledProcessError as e:
        print(f"Erro ao processar áudio: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar o áudio")
    except Exception as e:
        print(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro inesperado")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8070)
