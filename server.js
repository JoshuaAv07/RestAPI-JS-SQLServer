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
    const { username, pass, email, avatar } = req.body;
    const protocol = req.originalUrl.split('/')[1];
    const crud = {
        update: `UPDATE tb_users SET username = '${username}', pass = '${pass}', email = '${email}', avatar = '${avatar}' WHERE id_user = ${id}`,
        delete: `DELETE FROM tb_users WHERE id_user = ${id}`,
        register: `INSERT INTO tb_users (username, pass, email, avatar) VALUES ('${username}', '${hash}', '${email}', '${avatar}')`,
        login: `SELECT * FROM tb_users WHERE username = '${username}'`,
    };
    const pool = new sql.ConnectionPool(conn.databases[0]);
    pool.on("error", err => {console.log(err)});
    //pool.on("success", succ => {console.log(succ)});
    
    try {
        console.log(protocol);
        if (protocol == 'login'){
            await pool.connect();
            const result = await pool.request().query(crud[protocol]);
            const compare = await bcrypt.compare(req.body.pass, result.recordset[0].pass);
        
            return r = {
                "success": result.recordset,
                "login": compare
            };
        } else {
            await pool.connect();
            const result = await pool.request().query(crud[protocol]);
        
            return r = {
                "success": result.recordset
            };
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
    res.send("Welcome to WikiManga!");
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
    const result = await crud_users(req, res);
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

app.use('/mangas', require('./router/manga'));
app.use('/authors', require('./router/authors'));

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
