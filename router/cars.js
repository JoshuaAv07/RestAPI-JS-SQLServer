const express = require('express');
const router = express.Router();
const sql = require('mssql');
const conn = require('../config');

router.use((req, res, next) =>{
    next();
});

async function crud_cars(req, res, hash){
    const { id } = req.params;
    const { brand, model, miles, id_user } = req.body;
    const protocol = req.originalUrl.split('/')[2];
    console.log(protocol);
    const crud = {
        read_all: `SELECT * FROM cars`,
        read_by_user: `SELECT * FROM cars WHERE id_user = ${id}`,
        read: `SELECT * FROM cars WHERE id = ${id}`,
        create: `INSERT INTO cars (brand, model, miles, id_user) VALUES ('${brand}', ${model}, ${miles}, ${id_user})`,
        update: `UPDATE cars SET brand = '${brand}', model = ${model}, miles = ${miles}, id_user = ${id_user} WHERE id = ${id}`,
        delete: `DELETE FROM cars WHERE id = ${id}`,
    };
    const pool = new sql.ConnectionPool(conn.databases[0]);
    pool.on("error", err => {console.log(err)});

    try {
        await pool.connect();
        const result = await pool.request().query(crud[protocol]);

        return r = {
            "success": result
        };
    }
    catch (error){
        return error;
    }
    finally {
        pool.close();
    }
}

router.get('/read_all', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

router.get('/read_by_user/:id', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

router.get('/read/:id', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

router.post('/create', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

router.put('/update/:id', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

router.delete('/delete/:id', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

module.exports = router;