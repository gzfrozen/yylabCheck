FROM node:latest
WORKDIR /usr/src/app
EXPOSE 3000
COPY src/package*.json ./
RUN npm install --production
COPY src/app.js ./
CMD ["npm", "start"]