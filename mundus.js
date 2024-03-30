
const express = require('express');
const mysql = require("mysql2");

class connectionMundus{
    constructor(){
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'meubdd.root',
            database: 'mundus'
        });
    }
    connect(){
        this.connection.connect(function(err){
            if(err){
                console.log("Erro ao estabelecer conexão com BD")
                return;
            }
            console.log("Conexão estabelecida...");
        });
    }
    end() {
        this.connection.end(function(err){
            if(err){
                console.log("Falha ao encerrar conexão com BD");
                return;
            }
            console.log("Conexão encerrada com sucesso")
        })
    }
}

const app = express();
app.use(express.json());

const connection = new connectionMundus().connection;



app.get('/livros', (req, res) => {
    connection.query('SELECT * FROM livros', (error, results, fields) => {
        if(err){
            console.log(error);
            res.status(500).json({error: "Erro ao buscar livros"});
            return;
        }
        res.status(200).json(results);
    });
});


app.post('/livros', (req, res) => {
    const { titulo, autor, genero, ano_publicacao, sinopse } = req.body;
    const query = 'INSERT INTO livros (titulo, autor, genero, ano_publicacao, sinopse) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [titulo, autor, genero, ano_publicacao, sinopse], (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao adicionar livro' });
            return;
        }
        res.status(201).json({ message: 'Livro adicionado com sucesso' });
    });
});


app.get('/livros/:id', (req, res) => {
    const livroId = req.params.id;
    const query = 'SELECT * FROM livros WHERE id = ?';
    connection.query(query, [livroId], (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar detalhes do livro' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Livro não encontrado' });
            return;
        }
        res.status(200).json(results[0]);
    });
});


app.put('/livros/:id', (req, res) => {
    const livroId = req.params.id;
    const { titulo, autor, genero, ano_publicacao, sinopse } = req.body;
    const query = 'UPDATE livros SET titulo=?, autor=?, genero=?, ano_publicacao=?, sinopse=? WHERE id=?';
    connection.query(query, [titulo, autor, genero, ano_publicacao, sinopse, livroId], (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao editar livro' });
            return;
        }
        res.status(200).json({ message: 'Livro editado com sucesso' });
    });
});

app.delete('/livros/:id', (req, res) => {
    const livroId = req.params.id;
    const query = 'DELETE FROM livros WHERE id=?';
    connection.query(query, [livroId], (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao excluir livro' });
            return;
        }
        res.status(200).json({ message: 'Livro excluído com sucesso' });
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});