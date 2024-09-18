import os
import whisper
import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File

app = FastAPI()

# Carrega o modelo uma vez só
model = whisper.load_model("small")

# Pasta para arquivos temporários
os.makedirs("tmp", exist_ok=True)

# Salva arquivo de input
def save_file(file: UploadFile, filename: str):
    with open(filename, "wb") as temp_file:
        temp_file.write(file.file.read())

@app.post('/transcribe')
async def transcribe(file: UploadFile):
    input_filename = "tmp/input.wav"

    try:
        save_file(file, input_filename)
        result = model.transcribe(input_filename, fp16=False, language='pt')
        text = result["text"].strip()
        return {"text": text}
    except Exception as e:
        print(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro inesperado")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)