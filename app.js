const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const createError = require('http-errors');

const app = express();

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Configurações da view Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

// Configurar a pasta de recursos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Lidar com erros internos do servidor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//requisicao de rotas
const viewRouter = require('./src/routes/viewRouter');

// rotas
app.use('/', viewRouter);


// Lidar com erros 404
app.use(function(req, res, next) {
  next(createError(404));
});

 // tratamento de erros
 app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // renderizar pagina de erros
  res.status(err.status || 500);
  res.render('error');
});

// Porta do servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor Express rodando na porta ${port}`);
});
