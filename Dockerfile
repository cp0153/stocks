FROM node:14 as base
WORKDIR /usr/src/app
COPY package.json ./
COPY . .
RUN npm install
RUN npm run build

FROM node:12.17.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist ./dist
EXPOSE 80
CMD npm start