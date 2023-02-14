
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
const conn = require('./config')
const bcrypt = require('bcrypt')

app.use(cors());
app.use(bodyParser.json({"limit": "100mb"}));
app.all("*", function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

async function crud_users(req, res, hash){
    const { id } = req.params;
    const { username, pass, email } = req.body;
    const protocol = req.originalUrl.split('/')[1];
    const crud = {
        read_all: `SELECT * FROM users`, 
        read: `SELECT * FROM users WHERE id = ${id}`, 
        create: `INSERT INTO users (username, pass, email) VALUES ('${username}', '${pass}', '${email}')`,
        update: `UPDATE users SET username = '${username}', pass = '${pass}', email = '${email}' WHERE id = ${id}`,
        delete: `DELETE FROM users WHERE id = ${id}`,
        register: `INSERT INTO users (username, pass, email) VALUES ('${username}', '${hash}', '${email}')`,
        login: `SELECT * FROM users WHERE username = '${username}'`,
    };
    const pool = new sql.ConnectionPool(conn.databases[0]);
    pool.on("error", err => {console.log(err)});
    //pool.on("success", succ => {console.log(succ)});
    try {
        await pool.connect();
        const result = await pool.request().query(crud[protocol]);
        
        return r = {
            "success": result
        };
    } 
    catch (error) {
        return error;
    }
    finally {
        pool.close();
    }
}

app.get('/', function(req, res){
    res.send("Hello World");
});

app.get('/read_all', async function(req, res){
    const result = await crud_users(req);
    console.log(result);
    res.send(result);
});

app.get('/read/:id', async function(req, res){
    const result = await crud_users(req);
    console.log(result);
    res.send(result);
});

app.post('/create', async function(req, res){
    const result = await crud_users(req);
    console.log(result);
    res.send(result);
});

app.put('/update/:id', async function(req, res){
    const result = await crud_users(req);
    console.log(result);
    res.send(result);
});

app.delete('/delete/:id', async function(req, res){
    const result = await crud_users(req, res);
    console.log(result);
    res.send(result);
});

app.post('/register', async function(req, res){
    const body = req.body;
    bcrypt.hash(body.pass, 10, async function(err, hash){
        const result = await crud_users(req, res, hash);
        console.log(result);
        res.send(result);
    });
});

app.post('/login', async function(req, res){
    const body = req.body;
    const result = await crud_users(req, res);
    console.log(result);
    res.send(result);
});

app.use('/cars', require('./router/cars'));

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.status(404).json({
        title: "Error 404"
    });
});

app.listen(port, () => {
    console.log(`App is running in port ${port}`);
});

module.exports = app;
