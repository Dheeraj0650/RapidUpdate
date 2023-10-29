FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV mongodb_password=Fc5tJsrwWijFEEBJ \
    SESSION_SECRET=NEVERTAKELIFETOOSERIOUS \ 
    PORT=8000

EXPOSE 8000

CMD ["node", "index.js"]