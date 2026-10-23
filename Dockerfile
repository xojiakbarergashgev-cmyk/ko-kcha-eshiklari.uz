FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache python3 py3-pip

COPY package.json ./
RUN npm install --production 2>/dev/null || true

COPY . ./

EXPOSE 3000

CMD ["node", "bot.js"]
