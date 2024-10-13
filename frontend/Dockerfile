# Etapa de construção
FROM node:16 as build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Etapa de produção
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copie um arquivo de configuração personalizado do Nginx para habilitar o roteamento correto
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
