FROM ghcr.io/raihara3/node:14

WORKDIR /build

COPY package*.json ./
RUN npm install

COPY next.config.js ./
COPY .env.* ./
COPY components/ components/
COPY core/ core/
COPY pages/ pages/
COPY public/ public/
COPY src/ src/
COPY styles/ styles/
COPY threeComponents/ threeComponents/
COPY nginx.conf /etc/nginx/

RUN npm run build

EXPOSE 3000
ENTRYPOINT [ "npm", "run"]
CMD [ "start" ]
