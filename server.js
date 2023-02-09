
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
const conn = require('./config')

app.use(cors());
app.use(bodyParser.json({"limit": "100mb"}));
app.all("*", function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

async function crud_users(req, res){
    const { id } = req.params;
    const { username, pass, email } = req.body;
    const protocol = req.originalUrl.split('/')[1];
    const crud = {
        read_all: `SELECT * FROM users`, 
        read: `SELECT * FROM users WHERE id = ${id}`, 
        create: `INSERT INTO users (username, pass, email) VALUES ('${username}', '${pass}', '${email}')`,
        update: `UPDATE users SET username = '${username}', pass = '${pass}', email = '${email}' WHERE id = ${id}`,
        delete: `DELETE FROM users WHERE id = ${id}`
    }
    const pool = new sql.ConnectionPool(conn.databases[0]);
    pool.on("error", err => {console.log(err)});
    //pool.on("success", succ => {console.log(succ)});
    try {
        await pool.connect();
        const result = await pool.request().query(crud[protocol]);
        
        return r = {
            "success": result
        }
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
    const result = await crud_users(req);
    console.log(result);
    res.send(result);
});

const fake_db = [
    {
        username: "Derek", 
        password: "123",
    },
    {
        username: "Joshua", 
        password: "456",
    },
    {
        username: "Fabian", 
        password: "789",
    },
];

app.post('/newuser', function(req, res){
    let body = req.body;
    fake_db.push(body);
    res.send(fake_db);
});

app.get('/getallusers', function(req, res){
    res.send(fake_db);
});

app.delete('/deleteuser', function(req, res){
    fake_db.splice(1);
    res.send(fake_db);
});

app.put('/updateuser', function(req, res){
    fake_db.splice(1);
    let body = req.body;
    fake_db.push(body);
    res.send(fake_db);
});

app.get('/getuser/:id', function(req, res){
    const id = req.params.id;
    
    /* for (let i = 0; i <= fake_db.length; i++){
        if (id == fake_db.i){
            console.log(fake_db.i);
        }
        console.log(fake_db);
    } */
    console.log(id);
    res.send(fake_db);
});

app.get('/add', function(req, res){
    let x = 2;
    let y = 6;
    let tt = x + y;
    res.send(`Addition: ${tt}`);
});

app.get('/subs', function(req, res){
    let x = 2;
    let y = 6;
    let tt = x - y;
    res.send(`Substraction: ${tt}`);
});

app.get('/mult', function(req, res){
    let x = 2;
    let y = 6;
    let tt = x * y;
    res.send(`Multiplication: ${tt}`);
});

app.get('/div', function(req, res){
    let x = 2;
    let y = 6;
    let tt = x / y;
    res.send(`Division: ${tt}`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    //
    console.log(`App is running in port ${port}`);
});