FROM node:16
  
WORKDIR /usr/src/app/todo-backend

COPY --chown=node:node . .
RUN npm ci 

ENV DEBUG=playground:*

USER node
CMD ["npm", "run", "dev", "--", "--host"]