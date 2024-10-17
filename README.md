Guia para Executar a Aplicação com Docker

Este documento fornece instruções detalhadas sobre como configurar e executar a aplicação em um ambiente Docker. A aplicação é composta por um frontend e um backend, e utiliza o Docker Compose para orquestrar os serviços.
Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados em seu sistema:

    Docker Desktop (para Windows e macOS): Download Docker Desktop
    Docker Engine (para Linux): Instalação do Docker no Linux
    Docker Compose: Instalação do Docker Compose

Estrutura do Projeto

A estrutura básica do projeto é a seguinte:

sistemas_distribuidos/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── Dockerfile
├── docker-compose.yml
└── README.md

    backend/: Contém o código-fonte do backend, um aplicativo Python Flask.
    frontend/: Contém o código-fonte do frontend, uma aplicação web estática servida pelo Nginx.
    docker-compose.yml: Arquivo de configuração do Docker Compose para orquestrar os serviços.
    README.md: Este arquivo com instruções para executar a aplicação.

Passo a Passo para Executar a Aplicação
1. Clonar o Repositório

Primeiramente, clone o repositório para sua máquina local:

bash

git clone https://github.com/seu-usuario/sistemas_distribuidos.git

2. Navegar até o Diretório do Projeto

Entre no diretório do projeto:

bash

cd sistemas_distribuidos

3. Construir e Iniciar os Serviços com Docker Compose

Execute o seguinte comando para construir as imagens Docker e iniciar os serviços em segundo plano:

bash

docker-compose up -d --build

Explicação:

    up: Inicia os containers.
    -d: Executa em segundo plano (modo detached).
    --build: Constrói as imagens antes de iniciar os containers.

4. Verificar os Serviços em Execução

Verifique se os containers estão em execução:

bash

docker ps

Você deve ver algo semelhante a:

bash

CONTAINER ID   IMAGE                          COMMAND                  STATUS          PORTS                  NAMES
abcd1234efgh   sistemas_distribuidos_frontend "nginx -g 'daemon of...'" Up 2 minutes    0.0.0.0:3000->80/tcp   sistemas_distribuidos_frontend_1
ijkl5678mnop   sistemas_distribuidos_backend  "python app.py"          Up 2 minutes    0.0.0.0:5000->5000/tcp sistemas_distribuidos_backend_1

5. Acessar a Aplicação

Abra um navegador web e acesse o frontend da aplicação em:

arduino

http://localhost:3000

Você deve ver a interface do frontend funcionando corretamente.
6. Testar a Comunicação com o Backend

Para verificar se o frontend está se comunicando com o backend, execute ações na interface que acionam chamadas ao backend e observe as respostas ou atualizações na interface.
7. Parar os Serviços

Quando quiser parar os serviços, execute:

bash

docker-compose down

Isso irá parar e remover os containers, redes e volumes criados pelo up.
Detalhes de Configuração
Arquivo docker-compose.yml

O arquivo docker-compose.yml define dois serviços: backend e frontend.

yaml

version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    networks:
      - app-network

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

Explicação:

    backend:
        build: Indica o diretório onde está o Dockerfile para construir a imagem do backend.
        ports: Mapeia a porta 5000 do host para a porta 5000 do container.
        networks: Conecta o serviço à rede app-network.
    frontend:
        build: Indica o diretório onde está o Dockerfile para construir a imagem do frontend.
        ports: Mapeia a porta 3000 do host para a porta 80 do container.
        depends_on: Define que o frontend depende do backend, garantindo que o backend seja iniciado primeiro.
        networks: Conecta o serviço à rede app-network.
    networks:
        Define a rede app-network usando o driver bridge, permitindo que os containers se comuniquem entre si pelo nome do serviço.

Dockerfile do Backend

O arquivo backend/Dockerfile contém as instruções para construir a imagem do backend.

dockerfile

# Utiliza uma imagem base do Python
FROM python:3.9-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de requisitos
COPY requirements.txt .

# Instala as dependências Python
RUN pip install -r requirements.txt

# Copia o código-fonte da aplicação
COPY . .

# Expõe a porta que a aplicação irá rodar
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["python", "app.py"]

Dockerfile do Frontend

O arquivo frontend/Dockerfile contém as instruções para construir a imagem do frontend.

dockerfile

# Utiliza a imagem oficial do Nginx como base
FROM nginx:latest

# Remove o arquivo de configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o arquivo de configuração personalizado
COPY nginx.conf /etc/nginx/conf.d

# Copia os arquivos estáticos do frontend
COPY . /usr/share/nginx/html

# Expõe a porta padrão do Nginx
EXPOSE 80

Arquivo de Configuração do Nginx

O arquivo frontend/nginx.conf configura o Nginx para servir o frontend e encaminhar as solicitações para o backend.

nginx

server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://backend:5000/;
    }
}

Explicação:

    location /: Serve os arquivos estáticos do frontend.
    location /api/: Encaminha as solicitações que começam com /api/ para o serviço backend na porta 5000.

Arquivo requirements.txt do Backend

O arquivo backend/requirements.txt lista as dependências Python do backend.

makefile

Flask==2.0.1
requests==2.26.0

Arquivo app.py do Backend

Um exemplo simples de app.py para o backend Flask.

python

from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/data')
def get_data():
    return jsonify({'data': 'Hello from the backend!'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

Dicas e Solução de Problemas

    Erro de Porta em Uso: Se receber um erro de que a porta já está em uso, certifique-se de que nenhum outro serviço está usando as portas 3000 ou 5000, ou altere as portas mapeadas no docker-compose.yml.

    Atualizações no Código: Se você fizer alterações no código do backend ou frontend, execute docker-compose up -d --build novamente para reconstruir as imagens com as alterações.

    Logs dos Containers: Para visualizar os logs de um container específico, use:

    bash

docker logs -f nome_do_container

Por exemplo:

bash

docker logs -f sistemas_distribuidos_backend_1

Acessar o Shell do Container: Para depurar ou executar comandos dentro de um container, use:

bash

    docker exec -it nome_do_container /bin/bash

Conclusão

Seguindo estes passos, você deve ser capaz de configurar e executar a aplicação em um ambiente Docker com facilidade. O uso do Docker e Docker Compose simplifica o processo de configuração e garante que o ambiente seja consistente em diferentes máquinas. Se você encontrar algum problema ou tiver dúvidas, não hesite em consultar a documentação oficial do Docker ou entrar em contato com o mantenedor do projeto.

Divirta-se explorando a aplicação!