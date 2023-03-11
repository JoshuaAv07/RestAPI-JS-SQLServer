const express = require('express');
const router = express.Router();
const sql = require('mssql');
const conn = require('../config');

async function crud_cars(req, res, hash){
    const { id } = req.params;
    const { name_author} = req.body;
    const protocol = req.originalUrl.split('/')[2];
    console.log(protocol);
    const crud = {
        read_all: `SELECT * FROM tb_authors`,
        read: `SELECT * FROM tb_authors WHERE id_author = ${id}`,
        create: `INSERT INTO tb_authors (name_author) VALUES ('${name_author}')`,
        update: `UPDATE tb_authors SET name_author = '${name_author}' WHERE id_author = ${id}`,
        delete: `DELETE FROM tb_authors WHERE id_author = ${id}`,
    };
    const pool = new sql.ConnectionPool(conn.databases[0]);
    pool.on("error", err => {console.log(err)});

    try {
        await pool.connect();
        const result = await pool.request().query(crud[protocol]);

        return r = {
            "success": result.recordset
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