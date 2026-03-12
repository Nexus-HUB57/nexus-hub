# Usando uma imagem leve e otimizada de Python
FROM python:3.11-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os requerimentos e instala as dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código-fonte do servidor (main.py)
COPY main.py .

# Expõe a porta 8000 para comunicação externa
EXPOSE 8000

# Comando para iniciar o servidor de alta performance
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]