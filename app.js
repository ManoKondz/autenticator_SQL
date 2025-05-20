const express = require('express');
const { engine } = require('express-handlebars');
const mysql = require('mysql2');

const app = express();

// View engine
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Conexão com MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'autenticator'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
        return;
    }
    console.log('Conectado ao MySQL.');
});

// Rota principal - exibe o formulário
app.get('/', (req, res) => {
    res.render('formulario');
});

// Rota de cadastro - insere no banco
app.post('/cadastrar', (req, res) => {
    const nome = req.body.nome;
    const materia = req.body.materia;

    console.log('Recebido:', { nome, materia });

    const sql = 'INSERT INTO form (Nome, Materia) VALUES (?, ?)';
    db.query(sql, [nome, materia], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco:', err.message);
            return res.status(500).send('Erro ao cadastrar');
        }

        console.log('Registro inserido com sucesso:', result);
        res.send('Cadastro realizado com sucesso.');
    });
});

// Iniciar servidor
app.listen(8050, () => {
    console.log('Servidor rodando em http://localhost:8050');
});
