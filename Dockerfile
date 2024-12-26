FROM node:18

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install all dependencies, including devDependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the application port
EXPOSE 3000

# Default command
CMD ["npm", "run", "dev"]