import express from 'express';
import cors from 'cors';
import routes from './src/routes/routes.js';

const app = express();

// Middleware para habilitar CORS
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definir rotas da aplicação
app.use('/api', routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

export default app;
