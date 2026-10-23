FROM node:22-alpine

WORKDIR /app

# Python va Pip o'rnatish
RUN apk add --no-cache python3 py3-pip

# Node va Python kutubxonalari
COPY package.json ./
RUN npm install --production 2>/dev/null || true

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages 2>/dev/null || true

# Barcha fayllarni nusxalash
COPY . ./

EXPOSE 3000

# Start
CMD ["node", "bot.js"]
