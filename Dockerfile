FROM node:latest
WORKDIR /usr/src/app
EXPOSE 3000
# CMD ["npm", "run", "local"]
CMD ["npm", "start"]