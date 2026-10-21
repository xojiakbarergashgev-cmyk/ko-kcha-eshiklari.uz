FROM node:22-alpine

WORKDIR /app

# Fayllarni nusxalash
COPY package.json ./
COPY bot.js ./
COPY assets ./assets
COPY data ./data
COPY database ./database
COPY .env ./

# Botni ishga tushirish
CMD ["node", "bot.js"]
