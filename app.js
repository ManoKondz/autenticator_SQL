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
    database: 'bd1905'
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
    const senha = req.body.senha;
    const email = req.body.email;
    const acesso = 0;

    console.log('Recebido:', { nome, senha, email, acesso});

    const sql = 'INSERT INTO auth (Nome, Senha, Email, NAcesso) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, senha, email, acesso], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco:', err.message);
            return res.status(500).send('Erro ao cadastrar');
        }

        console.log('Registro inserido com sucesso:', result);
        res.send('Cadastro realizado com sucesso.');
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    const sql = 'SELECT Nome, Senha, NAcesso FROM auth WHERE Email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err.message);
            return res.status(500).send('Erro no servidor');
        }

        if (results.length === 0) {
            return res.status(401).send('Usuário não encontrado');
        }

        const usuario = results[0];

        if (usuario.Senha !== senha) {
            return res.status(401).send('Senha incorreta');
        }

        const frase = usuario.NAcesso === 1
            ? 'Bem-vindo, administrador!'
            : 'Bem-vindo, usuário comum!';

        res.render('acesso', {
            nome: usuario.Nome,
            frase
        });
    });
});

// Iniciando server
app.listen(8050, () => {
    console.log('Servidor rodando em http://localhost:8050');
});
