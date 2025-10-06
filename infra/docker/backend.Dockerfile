FROM node:20-alpine
WORKDIR /app
COPY apps/backend/package.json ./
RUN npm install
COPY apps/backend/ ./
EXPOSE 8080
CMD ["npm", "start"]