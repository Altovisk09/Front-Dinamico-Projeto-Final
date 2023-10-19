const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

const app = express();

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Configurar a pasta de recursos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Lidar com erros 404
app.use((req, res, next) => {
  res.status(404).send('Página não encontrada');
});

// Lidar com erros internos do servidor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Porta do servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor Express rodando na porta ${port}`);
});
