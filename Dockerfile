# Usar una imagen base de Node.js
FROM node:18.17.0

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación React
RUN npm run build

# Exponer el puerto en el que se ejecutará la aplicación (el valor predeterminado para React es 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
